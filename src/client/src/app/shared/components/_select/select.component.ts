import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';
import {AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors} from '@angular/forms';
import {MatLegacyFormFieldAppearance as MatFormFieldAppearance} from '@angular/material/legacy-form-field';
import {ThemePalette} from '@angular/material/core';
import {SelectItem} from '~app/typings/select/select.interfaces';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatSelectModule, ReactiveFormsModule, NgIf, NgTemplateOutlet, NgForOf],
})
export class SelectComponent {
  @Input() public control = new FormControl();
  @Input() public color: ThemePalette;
  @Input() public appearance: MatFormFieldAppearance = 'standard';
  @Input() public extendClass = '';
  @Input() public label = '';
  @Input() public items: Array<SelectItem> = [];
  // @Input() public itemGroups: Array<SelectItemGroup> = [];
  @Input() public hint?: TemplateRef<unknown>;
  @Input() public errorMessage?: (errors: ValidationErrors | null) => string | void;
  @Input() public required?: boolean;

  public get isRequired(): boolean {
    return (
      this.required ?? Boolean(this.control.validator && this.control.validator({} as AbstractControl)?.['required'])
    );
  }
}
