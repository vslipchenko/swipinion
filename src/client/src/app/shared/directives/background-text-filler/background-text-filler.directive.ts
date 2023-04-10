import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {debounceTime, fromEvent, Subject, takeUntil} from 'rxjs';
import {Destroyable} from '~app/typings/component/component.interfaces';

@Directive({
  selector: '[appBackgroundTextFiller]',
  standalone: true,
})
export class BackgroundTextFillerDirective implements AfterViewInit, Destroyable {
  @Input('appBackgroundTextFiller') public text = '';

  public readonly destroy$ = new Subject<void>();

  public constructor(private readonly elementRef: ElementRef) {}

  public ngAfterViewInit(): void {
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$), debounceTime(200))
      .subscribe(() => this.fillWithText());

    this.fillWithText();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fillWithText(): void {
    // const elementStyles = window.getComputedStyle(this.elementRef.nativeElement);
    //
    // if (elementStyles.display === 'none') return; // prevents unnecessary recalculation on screens with narrow width (most mobiles)

    this.elementRef.nativeElement.textContent = this.text;

    while (this.elementRef.nativeElement.scrollHeight <= this.elementRef.nativeElement.clientHeight * 2.5) {
      // 2.5 is an optimal coefficient here to generate content that would fill container fully
      this.elementRef.nativeElement.textContent += ` ${this.elementRef.nativeElement.textContent}`; // Using incremental content add reduces count of cycle runs improving performance
    }
  }
}
