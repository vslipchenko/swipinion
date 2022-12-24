import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxComponent} from '~app/shared/components/checkbox/checkbox.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [CheckboxComponent],
  imports: [CommonModule, MatCheckboxModule, ReactiveFormsModule],
  exports: [CheckboxComponent],
})
export class CheckboxModule {}
