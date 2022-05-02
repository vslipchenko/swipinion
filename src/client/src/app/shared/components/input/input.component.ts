import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';
import {InputType} from '~app/typings/input/input.types';
import {FormControl, ValidationErrors} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {FloatLabelType, MatFormFieldAppearance} from '@angular/material/form-field';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
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
  // @Input() public prefix?: TemplateRef<unknown>;
  @Input() public suffix?: TemplateRef<unknown>;
  @Input() public prefix?: TemplateRef<unknown>;
  @Input() public hint?: TemplateRef<unknown>;
  @Input() public hintAlign: 'start' | 'end' = 'start';
  @Input() public hintClass = '';
  @Input() public floatLabel: FloatLabelType = 'auto';
  @Input() public maxlength?: string | number;

  public hide = true;

  public toggleVisibility(): void {
    if (this.type === 'password') this.hide = !this.hide;
  }

  public get inputType(): InputType {
    return this.type === 'password' && !this.hide ? 'text' : this.type;
  }
}
