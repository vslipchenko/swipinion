import {ChangeDetectionStrategy, Component, ElementRef, Input, QueryList, ViewChildren} from '@angular/core';
import {Opinion} from '~app/typings/opinion/opinion.interfaces';
import {OpinionCardComponent} from '~app/modules/opinions/components/opinion-card/opinion-card.component';
import {
  OPINION_CARD_HORIZONTAL_ANIMATION_DURATION,
  OPINION_CARD_MAX_WIDTH,
  OPINION_CARD_VERTICAL_ANIMATION_DURATION,
} from '~app/constants/opinions';
import {OpinionCardSlideDirection, OpinionReaction} from '~app/typings/opinion/opinion.enums';
import {Store} from '@ngxs/store';
import {RemoveTopMostOpinion} from '~app/modules/opinions/store/opinions.actions';
import {AuthClickConfiguration} from '~app/typings/auth-click/auth-click.types';
import {CommentDialogComponent} from '~app/modules/opinions/components/comment-dialog/comment-dialog.component';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-opinion-carousel',
  templateUrl: './opinion-carousel.component.html',
  styleUrls: ['./opinion-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionCarouselComponent {
  @Input() public data: Array<Opinion> = [];

  @ViewChildren(OpinionCardComponent, {read: ElementRef}) private readonly cards!: QueryList<ElementRef>;

  protected skipAuthClickConfiguration: AuthClickConfiguration = {
    allowUnauthenticatedClickCount: 1,
    method: this.skip.bind(this),
  };

  public constructor(private readonly store: Store, private readonly dialog: MatDialog) {}

  protected agree(): void {
    this.swipeHorizontally(OpinionCardSlideDirection.Left);
  }

  protected disagree(): void {
    this.swipeHorizontally(OpinionCardSlideDirection.Right);
  }

  protected agreeAndComment(): void {
    this.openCommentDialog(OpinionReaction.Agree);
  }

  protected disagreeAndComment(): void {
    this.openCommentDialog(OpinionReaction.Disagree);
  }

  protected skip(): void {
    this.swipeHorizontally(OpinionCardSlideDirection.Top);
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
        this.store.dispatch(new RemoveTopMostOpinion());
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
      this.swipeHorizontally(
        reaction === OpinionReaction.Agree ? OpinionCardSlideDirection.Left : OpinionCardSlideDirection.Right,
      );
      dialog.close();
    });
  }
}
