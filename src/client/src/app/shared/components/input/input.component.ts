import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TemplateRef} from '@angular/core';
import {InputType} from '~app/typings/input/input.types';
import {FormControl, ReactiveFormsModule, ValidationErrors} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {
  LegacyFloatLabelType as FloatLabelType,
  MatLegacyFormFieldAppearance as MatFormFieldAppearance,
} from '@angular/material/legacy-form-field';
import {Observable, Subject, takeUntil} from 'rxjs';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {NgIf, NgTemplateOutlet} from '@angular/common';
import {MatLegacyInputModule} from '@angular/material/legacy-input';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatLegacyInputModule, ReactiveFormsModule, NgIf, NgTemplateOutlet],
})
export class InputComponent implements OnInit, Destroyable {
  @Input() public type: InputType = 'text';
  @Input() public control = new FormControl();
  @Input() public errorMessage?: (errors: ValidationErrors | null) => string | void;
  // @Input() public required = false;
  // @Input() public disabled = false;
  @Input() public color: ThemePalette;
  @Input() public appearance: MatFormFieldAppearance = 'standard';
  @Input() public extendClass = '';
  @Input() public label = '';
  @Input() public placeholder = '';
  @Input() public render?: Observable<void>;
  // @Input() public prefix?: TemplateRef<unknown>;
  @Input() public suffix?: TemplateRef<unknown>;
  @Input() public prefix?: TemplateRef<unknown>;
  @Input() public hint?: TemplateRef<unknown>;
  @Input() public hintAlign: 'start' | 'end' = 'start';
  @Input() public hintClass = '';
  @Input() public floatLabel: FloatLabelType = 'auto';
  @Input() public maxlength?: string | number;

  public hide = true;
  public readonly destroy$ = new Subject<void>();

  public constructor(private readonly changeDetector: ChangeDetectorRef) {}

  public ngOnInit(): void {
    if (this.render) {
      this.render.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.changeDetector.detectChanges();
      });
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public toggleVisibility(): void {
    if (this.type === 'password') this.hide = !this.hide;
  }

  public get inputType(): InputType {
    return this.type === 'password' && !this.hide ? 'text' : this.type;
  }
}
