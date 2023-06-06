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
  OPINION_CARD_HORIZONTAL_ANIMATION_DURATION,
  OPINION_CARD_MAX_WIDTH,
  OPINION_CARD_VERTICAL_ANIMATION_DURATION,
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

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly authenticationService: AuthenticationService,
  ) {}

  protected agree(): void {
    // Ghost-locking UI
    if (this.reactionInProgress) return;

    this.store.dispatch(new ToggleReactionInProgress(true));
    this.reactToOpinion(OpinionReaction.Agree);
    this.swipeHorizontally(OpinionCardSlideDirection.Left);
  }

  protected disagree(): void {
    // Ghost-locking UI
    if (this.reactionInProgress) return;

    this.store.dispatch(new ToggleReactionInProgress(true));
    this.reactToOpinion(OpinionReaction.Disagree);
    this.swipeHorizontally(OpinionCardSlideDirection.Right);
  }

  protected agreeAndComment(): void {
    if (this.reactionInProgress) return;

    this.openCommentDialog(OpinionReaction.Agree);
  }

  protected disagreeAndComment(): void {
    if (this.reactionInProgress) return;

    this.openCommentDialog(OpinionReaction.Disagree);
  }

  protected skip(): void {
    if (this.reactionInProgress) return;

    this.store.dispatch(new ToggleReactionInProgress(true));
    this.swipeHorizontally(OpinionCardSlideDirection.Top);
    // First most skip is not a subject for auth guarding, therefore auth condition has to be checked manually
    if (this.authenticationService.authenticated) this.reactToOpinion(OpinionReaction.Skip);
  }

  private reactToOpinion(reaction: OpinionReaction): void {
    const opinionId = this.store.selectSnapshot(OpinionsSelectors.activeOpinion).id;

    this.store.dispatch(
      new ReactToUserOpinion({
        opinionId,
        reaction,
        comment: null,
        optimisticStatisticUpdate: true,
      }),
    );
  }

  private swipeHorizontally(direction: OpinionCardSlideDirection): void {
    // Carousel's width is equal to the window's inner width
    const windowWidth = window.innerWidth;
    // card-container element resides in opinion-card.component
    const element = this.cards.last.nativeElement.querySelector('.card-container');
    const offset = windowWidth <= OPINION_CARD_MAX_WIDTH ? -windowWidth / 2 : -OPINION_CARD_MAX_WIDTH / 2; // Offset is equal to card's half width
    const duration =
      direction === OpinionCardSlideDirection.Top // Skip animation happens a little faster
        ? OPINION_CARD_VERTICAL_ANIMATION_DURATION
        : OPINION_CARD_HORIZONTAL_ANIMATION_DURATION;
    // Record the start time
    const startTime = performance.now();

    element.classList.add(`swipe-${direction}`);

    const slide = (): void => {
      // Calculate the elapsed time since the start of the animation
      const elapsed = performance.now() - startTime;
      // Calculate the progress of the animation (a value between 0 and 1)
      const progress = Math.min(elapsed / duration, 1);
      // Calculate the new position of the element based on the progress
      const currentOffset = offset * progress;
      // Update the element's position by setting its 'left' CSS property
      element.style[direction] = `${currentOffset}px`;
      // Set new opacity value of a parent element that should include both content container and background
      element.parentElement.style.opacity = (1 - progress).toString();
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

      this.swipeHorizontally(
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
      const prefetchInProgress = this.store.selectSnapshot(OpinionsSelectors.prefetchInProgress);

      if (!prefetchInProgress) this.prefetchOpinions.next();
    }
  }

  // Helps to prevent user actions while processing current (ongoing) reaction
  private get reactionInProgress(): boolean {
    return this.store.selectSnapshot(OpinionsSelectors.reactionInProgress);
  }
}
