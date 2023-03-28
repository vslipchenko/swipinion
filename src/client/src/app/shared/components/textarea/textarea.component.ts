import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';
import {FormControl, ReactiveFormsModule, ValidationErrors} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {MatLegacyFormFieldAppearance as MatFormFieldAppearance} from '@angular/material/legacy-form-field';
import {NgIf, NgTemplateOutlet} from '@angular/common';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgTemplateOutlet, MatInputModule, ReactiveFormsModule],
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
  @Input() public placeholder = '';

  public resetValue(): void {
    this.control.setValue('');
  }
}
