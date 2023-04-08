import {AfterViewInit, Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appSwipe]',
  standalone: true,
})
export class SwipeDirective implements AfterViewInit {
  private readonly startCoordinates: any;
  private readonly EndCoordinates: any;

  public constructor(private readonly elementRef: ElementRef) {}

  public ngAfterViewInit(): void {
    const element = this.elementRef.nativeElement;
    // console.log(element);
    element.addEventListener('touchmove', (event: any) => {
      // console.log(1, event);
    });

    // element.addEventListener('touchend', (event: any) => {
    //   console.log(2, event);
    // });
  }
}
