import {AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output} from '@angular/core';

@Directive({
  selector: '[appInView]',
  standalone: true,
})
export class InViewDirective implements AfterViewInit, OnDestroy {
  @Output() public appInView = new EventEmitter<boolean>();

  private intersection$!: IntersectionObserver;

  public constructor(private readonly elementRef: ElementRef) {}

  public ngOnDestroy(): void {
    this.intersection$.disconnect();
  }

  public ngAfterViewInit(): void {
    const observedElement = this.elementRef.nativeElement;

    this.intersection$ = new IntersectionObserver(
      ([entry]) => {
        this.appInView.emit(entry.isIntersecting);
      },
      {
        threshold: 0.01,
        root: null,
        rootMargin: '0px',
      },
    );

    this.intersection$.observe(observedElement);
  }
}
