import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable, Subject, takeUntil} from 'rxjs';
import {OpinionsSelectors} from '~app/modules/opinions/store/opinions.selectors';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {OpinionsContainerSizes} from '~app/typings/opinions/opinions.interfaces';

@Component({
  selector: 'app-text-background-filler',
  templateUrl: './text-background-filler.component.html',
  styleUrls: ['./text-background-filler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TextBackgroundFillerComponent implements AfterViewInit, Destroyable {
  @Select(OpinionsSelectors.containerSizes) public containerSizes!: Observable<OpinionsContainerSizes>;

  @Input() public text = '';

  @ViewChild('canvas', {static: true}) private readonly canvasElement!: ElementRef<HTMLCanvasElement>;

  public readonly destroy$ = new Subject<void>();
  // Canvas Properties
  private readonly fontSize = 100;
  private readonly lineHeight = this.fontSize;
  private readonly textAlign = 'center';
  private fontColor = '';
  private fontFamily = '';
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;

  private words: Array<string> = [];

  public constructor(private readonly elementRef: ElementRef) {}

  public ngAfterViewInit(): void {
    this.words = this.text.split(' ');
    this.setupCanvas();
    // Rerender canvas on viewport resize
    this.containerSizes.pipe(takeUntil(this.destroy$)).subscribe(this.renderTextBackground.bind(this));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupCanvas(): void {
    this.canvas = this.canvasElement.nativeElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    const {fontFamily, color} = window.getComputedStyle(this.canvas); // Extract inherited css properties
    // Set inherited css properties to avoid code duplicate
    this.fontColor = color;
    this.fontFamily = fontFamily;
  }

  private renderTextBackground({width, height}: OpinionsContainerSizes): void {
    // Set the canvas width and height with respect to viewport width and height
    this.canvas.width = width;
    this.canvas.height = height;

    // Set the font properties
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    this.context.fillStyle = this.fontColor;

    this.context.textAlign = this.textAlign;

    let i = 0; // Word index counter
    let newLine = true; // Required to avoid whitespaces for each first word in a line;
    let textHeight = this.lineHeight;

    while (textHeight < this.canvas.height) {
      // Generate new lines until canvas height overflow
      let textLine = '';

      while (this.context.measureText(textLine).width < this.canvas.width) {
        // Generate text line until canvas width overflow
        if (!this.words[i]) i = 0; // In a case if single word/char is provided reset counter to fill with only that specific word/char

        textLine += newLine ? this.words[i] : ' ' + this.words[i];

        newLine = false;
        i++;
      }

      newLine = true;
      // Render line of text: width / 2 - center aligned
      this.context.fillText(textLine, width / 2, textHeight, this.canvas.width);

      textHeight += this.lineHeight;
    }
  }
}
