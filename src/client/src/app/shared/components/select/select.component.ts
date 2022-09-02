import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';
import {AbstractControl, UntypedFormControl, ValidationErrors} from '@angular/forms';
import {MatFormFieldAppearance} from '@angular/material/form-field';
import {ThemePalette} from '@angular/material/core';
import {SelectItem} from '~app/typings/select/select.interfaces';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  @Input() public control = new UntypedFormControl();
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
