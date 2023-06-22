import {Directive, ElementRef, OnDestroy} from '@angular/core';
import {OPINION_CARD_MAX_WIDTH} from '~app/constants/opinions';
import {OpinionCardSlideDirection, OpinionReaction} from '~app/typings/opinion/opinion.enums';
import {halfWidthRelativeToViewport} from '~app/utilities/viewport';
import {ReactionService} from '~app/services/reaction/reaction.service';

@Directive({
  selector: '[appSwipe]',
  standalone: true,
})
export class SwipeDirective implements OnDestroy {
  // Variables to keep track of touch start and end positions
  private touchStartX = 0;
  private touchStartY = 0;
  private touchEndX = 0;
  // Used to track touch duration
  private touchStartAt = 0;
  // Used to lock to specific direction during swipe
  private horizontalLock = false; // Assume swipe takes place
  private verticalLock = false; // Assume vertical scrolling takes place
  // Used to determine ongoing swipe direction and switch between left/right swipe styles seamlessly if user drags cards in multiple directions
  private swipeDirectionTrend = OpinionCardSlideDirection.Left;
  // Target element
  private readonly element: HTMLDivElement = this.elementRef.nativeElement;
  // Threshold values for swipe distance and time
  private readonly swipeDistanceThreshold = 100; // px; If swipe longer than this, consider user swiping
  private readonly swipeDurationThreshold = 600; // ms; If swipe duration less than that and swipeThresholdDistance > 100 - treat it as a swipe gesture; otherwise - drag gesture
  // Used to determine horizontal/vertical swipe takes place based on one's coordinate gain/growth rate
  private readonly directionDifferentiationCoefficient = 2;

  public constructor(private readonly elementRef: ElementRef, private readonly reactionService: ReactionService) {
    this.element.addEventListener('touchstart', this.touchStart.bind(this), false);
    this.element.addEventListener('touchmove', this.touchMove.bind(this), false);
    this.element.addEventListener('touchend', this.touchEnd.bind(this), false);
  }

  public ngOnDestroy(): void {
    this.element.removeEventListener('touchstart', this.touchStart.bind(this));
    this.element.removeEventListener('touchmove', this.touchMove.bind(this));
    this.element.removeEventListener('touchend', this.touchEnd.bind(this));
  }

  private touchStart(event: TouchEvent): void {
    // Preserve the starting position of the touch
    this.touchStartX = event.touches[0].pageX;
    this.touchStartY = event.touches[0].pageY;
    this.touchStartAt = performance.now();
  }

  private touchMove(event: TouchEvent): void {
    const currentTouchX = event.touches[0].pageX;
    const currentTouchY = event.touches[0].pageY;

    const deltaX = currentTouchX - this.touchStartX;
    const deltaY = Math.abs(currentTouchY - this.touchStartY);

    if (
      (deltaX < 0 && this.swipeDirectionTrend === OpinionCardSlideDirection.Right) ||
      (deltaX > 0 && this.swipeDirectionTrend === OpinionCardSlideDirection.Left)
    ) {
      // Assume 'swing' dragging occurs along x axis
      // Remove swipe classes
      this.element.parentElement!.classList.remove('swipe-left', 'swipe-right');
    }
    // Keep track of swipe direction trend
    this.swipeDirectionTrend = deltaX < 0 ? OpinionCardSlideDirection.Left : OpinionCardSlideDirection.Right;

    const absoluteDeltaX = Math.abs(deltaX);

    if (this.horizontalLock || absoluteDeltaX > deltaY * this.directionDifferentiationCoefficient) {
      if (this.verticalLock) return; // Prevents x axis swiping when vertical scrolling takes place

      // Disable vertical scrolling; Prevents from vertical swiping when moving along x axis
      this.element.style.overflow = 'hidden';

      // Add box-shadow swipe effect (classList.add ignores adding duplicate class)
      this.element.parentElement!.classList.add(`swipe-${this.swipeDirectionTrend}`);

      this.horizontalLock = true; // Makes possible to freely swing the card along x axis preventing accidental vertical scrolling

      const half = halfWidthRelativeToViewport(OPINION_CARD_MAX_WIDTH);

      if (absoluteDeltaX < half) {
        // Calculate opacity difference solving proportion:
        // half - 0.5
        // absoluteDeltaX - x
        const opacityDifference = (absoluteDeltaX * 0.5) / half;
        const opacity = (1 - opacityDifference).toString();

        this.element.parentElement!.style.transform = `translateX(${deltaX}px)`;
        (this.element.previousElementSibling as HTMLDivElement).style.opacity = opacity;
        this.element.style.opacity = opacity;
      } else {
        // Fixes issue when x offset is not reaching half value
        this.element.parentElement!.style.transform = `translateX(${Math.sign(deltaX) * half}px)`;
      }
    } else {
      // Assume vertical scrolling
      this.verticalLock = true; // Prevents from horizontal swiping when moving along y axis
    }
  }

  private touchEnd(event: TouchEvent): void {
    // Swipe duration in milliseconds
    const swipeDuration = performance.now() - this.touchStartAt;
    // Get the ending position of the touch
    this.touchEndX = event.changedTouches[0].pageX;

    // Calculate the distance difference
    const deltaX = this.touchEndX - this.touchStartX;

    // Release all locks
    this.horizontalLock = false;
    this.verticalLock = false;

    const half = halfWidthRelativeToViewport(OPINION_CARD_MAX_WIDTH);

    const absoluteDeltaX = Math.abs(deltaX);

    const swipeDetected =
      absoluteDeltaX >= half ||
      (swipeDuration < this.swipeDurationThreshold && absoluteDeltaX >= this.swipeDistanceThreshold);

    // Determine if it was a left or right swipe
    if (swipeDetected) {
      this.reactionService.react$.next({
        slideDirection: this.swipeDirectionTrend,
        reaction:
          this.swipeDirectionTrend === OpinionCardSlideDirection.Left
            ? OpinionReaction.Agree
            : OpinionReaction.Disagree,
      });
      // Manually remove attached events to prevent ongoing swipe animation interruption
      this.ngOnDestroy();
    } else {
      this.element.parentElement!.style.transition = `transform 0.2s`;
      this.element.parentElement!.style.transform = `translateX(0px)`;

      setTimeout(() => (this.element.parentElement!.style.transition = ''), 210);

      this.element.style.overflow = 'auto';
      this.element.style.opacity = '1';
      (this.element.previousElementSibling as HTMLDivElement).style.opacity = '1';
      this.element.parentElement!.classList.remove('swipe-left', 'swipe-right');
    }
  }
}
