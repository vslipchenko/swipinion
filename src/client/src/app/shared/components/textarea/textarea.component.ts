import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';
import {FormControl, ValidationErrors} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {MatFormFieldAppearance} from '@angular/material/form-field';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent {
  @Input() public control = new FormControl();
  @Input() public errorMessage?: (errors: ValidationErrors | null) => string | void;
  @Input() public color: ThemePalette;
  @Input() public appearance: MatFormFieldAppearance = 'standard';
  @Input() public extendClass = '';
  @Input() public label = '';
  @Input() public hint?: TemplateRef<unknown>;
  @Input() public hintAlign: 'start' | 'end' = 'start';

  public resetValue(): void {
    this.control.setValue('');
  }
}
