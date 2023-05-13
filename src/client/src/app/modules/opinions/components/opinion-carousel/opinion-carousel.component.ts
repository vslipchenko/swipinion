import {ChangeDetectionStrategy, Component, ElementRef, Input, QueryList, ViewChildren} from '@angular/core';
import {Opinion} from '~app/typings/opinion/opinion.interfaces';
import {OpinionCardComponent} from '~app/modules/opinions/components/opinion-card/opinion-card.component';
import {NgForOf} from '@angular/common';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';
import {OPINION_CARD_MAX_WIDTH, OPINION_CARD_SWIPE_ANIMATION_DURATION} from '~app/constants/opinions';
import {OpinionCardOffset} from '~app/typings/opinion/opinion.enums';
import {Store} from '@ngxs/store';
import {RemoveTopMostOpinion} from '~app/modules/opinions/store/opinions.actions';

@Component({
  selector: 'app-opinion-carousel',
  templateUrl: './opinion-carousel.component.html',
  styleUrls: ['./opinion-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgForOf, OpinionCardComponent, IconButtonComponent],
})
export class OpinionCarouselComponent {
  @Input() public data: Array<Opinion> = [];

  @ViewChildren(OpinionCardComponent, {read: ElementRef}) private readonly cards!: QueryList<ElementRef>;

  public constructor(private readonly store: Store) {}

  protected agree(): void {
    this.swipeHorizontally(OpinionCardOffset.Left);
  }

  protected disagree(): void {
    this.swipeHorizontally(OpinionCardOffset.Right);
  }

  private swipeHorizontally(direction: OpinionCardOffset): void {
    // Carousel's width is equal to the window's inner width
    const windowWidth = window.innerWidth;
    // card-container element resides in opinion-card.component
    const element = this.cards.last.nativeElement.querySelector('.card-container');
    const offset = windowWidth <= OPINION_CARD_MAX_WIDTH ? -windowWidth / 2 : -OPINION_CARD_MAX_WIDTH / 2; // Offset is equal to card's half width
    const duration = OPINION_CARD_SWIPE_ANIMATION_DURATION;
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
}
