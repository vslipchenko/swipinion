import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxComponent} from '~app/shared/components/checkbox/checkbox.component';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [CheckboxComponent],
  imports: [CommonModule, MatCheckboxModule, ReactiveFormsModule],
  exports: [CheckboxComponent],
})
export class CheckboxModule {}
