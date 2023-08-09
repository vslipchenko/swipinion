import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {OpinionCardComponent} from '~app/modules/opinions/components/opinion-card/opinion-card.component';
import {
  OPINION_CARD_HORIZONTAL_SLIDE_DURATION,
  OPINION_CARD_HORIZONTAL_SWIPED_SLIDE_DURATION,
  OPINION_CARD_MAX_WIDTH,
  OPINION_CARD_VERTICAL_SLIDE_DURATION,
  OPINION_LIMIT_BEFORE_PREFETCH,
} from '~app/constants/opinions';
import {OpinionCardSlideDirection, OpinionReaction} from '~app/typings/opinion/opinion.enums';
import {Store} from '@ngxs/store';
import {
  ReactToUserOpinion,
  RemoveTopMostOpinion,
  ToggleReactionInProgress,
} from '~app/modules/opinions/store/opinions.actions';
import {AuthClickConfiguration} from '~app/typings/auth-click/auth-click.types';
import {CommentDialogComponent} from '~app/modules/opinions/components/comment-dialog/comment-dialog.component';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {takeUntil} from 'rxjs';
import {CarouselOpinion} from '~app/typings/opinion/opinion.types';
import {OpinionsSelectors} from '~app/modules/opinions/store/opinions.selectors';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {halfWidthRelativeToViewport} from '~app/utilities/viewport';
import {ReactionService} from '~app/services/reaction/reaction.service';
import {untilDestroyed} from '~app/utilities/operator';

@Component({
  selector: 'app-opinion-carousel',
  templateUrl: './opinion-carousel.component.html',
  styleUrls: ['./opinion-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionCarouselComponent {
  @Input() public data: Array<CarouselOpinion> = [];
  @Output() public prefetchOpinions = new EventEmitter<void>();

  @ViewChildren(OpinionCardComponent, {read: ElementRef}) private readonly cards!: QueryList<ElementRef>;

  protected skipAuthClickConfiguration: AuthClickConfiguration = {
    allowUnauthenticatedClickCount: 1,
    method: this.skip.bind(this),
  };

  private readonly untilDestroyed = untilDestroyed();

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly authenticationService: AuthenticationService,
    private readonly reactionService: ReactionService,
  ) {
    this.reactionService.swipeReaction$.pipe(this.untilDestroyed()).subscribe(({reaction, slideDirection}) => {
      this.react(reaction, slideDirection, true);
    });
  }

  protected agree(): void {
    // Ghost-locking UI
    if (this.reactionService.reactionInProgress) return;

    this.react(OpinionReaction.Agree, OpinionCardSlideDirection.Left);
  }

  protected disagree(): void {
    // Ghost-locking UI
    if (this.reactionService.reactionInProgress) return;

    this.react(OpinionReaction.Disagree, OpinionCardSlideDirection.Right);
  }

  protected agreeAndComment(): void {
    if (this.reactionService.reactionInProgress) return;

    this.openCommentDialog(OpinionReaction.Agree);
  }

  protected disagreeAndComment(): void {
    if (this.reactionService.reactionInProgress) return;

    this.openCommentDialog(OpinionReaction.Disagree);
  }

  protected skip(): void {
    if (this.reactionService.reactionInProgress) return;

    this.react(OpinionReaction.Skip, OpinionCardSlideDirection.Top);
  }

  private react(reaction: OpinionReaction, slideDirection: OpinionCardSlideDirection, swipeGesture?: boolean): void {
    this.store.dispatch(new ToggleReactionInProgress(true));

    if (reaction === OpinionReaction.Skip) {
      // First most skip is not a subject for auth guarding, therefore auth condition has to be checked manually before making request
      if (this.authenticationService.authenticated) this.reactToOpinion(reaction);
    } else {
      // Assume Agree or Disagree reaction
      this.reactToOpinion(reaction);
    }

    this.swipeCard(slideDirection, swipeGesture);
  }

  private reactToOpinion(reaction: OpinionReaction): void {
    const {id, username} = this.store.selectSnapshot(OpinionsSelectors.activeOpinion);

    this.store.dispatch(
      new ReactToUserOpinion({
        opinionId: id,
        username,
        reaction,
        comment: null,
        optimisticStatisticUpdate: true,
      }),
    );
  }

  private swipeCard(direction: OpinionCardSlideDirection, swipeGesture?: boolean): void {
    // card-container element resides in opinion-card.component
    const element = this.cards.last.nativeElement.querySelector('.card-container') as HTMLDivElement;
    const offset = -halfWidthRelativeToViewport(OPINION_CARD_MAX_WIDTH); // Offset is equal to card's half width if viewport width > OPINION_CARD_MAX_WIDTH; otherwise OPINION_CARD_MAX_WIDTH / 2

    let duration = OPINION_CARD_VERTICAL_SLIDE_DURATION;

    if (direction !== OpinionCardSlideDirection.Top) {
      duration = swipeGesture ? OPINION_CARD_HORIZONTAL_SWIPED_SLIDE_DURATION : OPINION_CARD_HORIZONTAL_SLIDE_DURATION;
    }

    // Record the start time
    const startTime = performance.now();
    // Skip add class if swiped gesture detected as it is already being added during touch move
    if (!swipeGesture) element.classList.add(`swipe-${direction}`);

    const slide = (): void => {
      // Calculate the elapsed time since the start of the animation
      const elapsed = performance.now() - startTime;
      // Calculate the progress of the animation (a value between 0 and 1)
      const progress = Math.min(elapsed / duration, 1);
      // Calculate the new position of the element based on the progress
      const currentOffset = offset * progress;
      // Update the element's position by setting its 'left' CSS property
      element.style[direction] = `${currentOffset}px`;
      // Update element opacity
      if (swipeGesture) {
        const backgroundElement = element.previousElementSibling as HTMLDivElement;
        // Set new opacity both for background and card itself separately as they have different fade out dynamics
        backgroundElement.style.opacity = (1 - progress).toString();
        element.style.opacity = (0.5 - progress).toString();
      } else {
        const containerElement = element.parentElement as HTMLDivElement;
        // Set new opacity value of a parent element that should include both content container and background
        containerElement.style.opacity = (1 - progress).toString();
      }
      // If the animation is not yet complete, request another frame of animation
      if (progress < 1) {
        requestAnimationFrame(slide);
      } else {
        // Remove element from DOM on animation complete
        // & notify animation has ended
        this.slideAnimationFinished();
      }
    };

    slide();
  }

  private openCommentDialog(reaction: OpinionReaction): void {
    const dialog = this.dialog.open(CommentDialogComponent, {
      panelClass: ['dialog', 'small-dialog'],
      data: {reaction},
    });

    dialog.componentInstance.reacted.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      this.store.dispatch(new ToggleReactionInProgress(true));

      this.swipeCard(
        reaction === OpinionReaction.Agree ? OpinionCardSlideDirection.Left : OpinionCardSlideDirection.Right,
      );
      dialog.close();
    });
  }

  private slideAnimationFinished(): void {
    this.store.dispatch(new RemoveTopMostOpinion());
    this.store.dispatch(new ToggleReactionInProgress(false));

    if (!this.authenticationService.authenticated) return; // Skip prefetch step for unauthenticated users

    if (this.data.length <= OPINION_LIMIT_BEFORE_PREFETCH) {
      // Optimal prefetch condition is when data.length = 2 or less,
      // because if it will be more than that then it will run prefetch on each swipe so some sort of interval or condition will be needed
      // P.S. this.data holds previous value at this point (use setTimeout or select from the store to get a relevant one)
      const prefetchInProgress = this.store.selectSnapshot(OpinionsSelectors.prefetchInProgress);

      if (!prefetchInProgress) this.prefetchOpinions.next();
    }
  }
}
