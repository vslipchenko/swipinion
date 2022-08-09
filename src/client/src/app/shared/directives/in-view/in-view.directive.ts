import {AfterViewInit, Directive, ElementRef, EventEmitter, Output} from '@angular/core';

@Directive({
  selector: '[appInView]',
})
export class InViewDirective implements AfterViewInit {
  @Output() public appInView = new EventEmitter<boolean>();

  public constructor(private readonly elementRef: ElementRef) {}

  public ngAfterViewInit(): void {
    const observedElement = this.elementRef.nativeElement;

    const observer = new IntersectionObserver(
      ([entry]) => {
        this.appInView.emit(entry.isIntersecting);
      },
      {
        threshold: 0.01,
        root: null,
        rootMargin: '0px',
      },
    );

    observer.observe(observedElement);
  }
}
