import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectComponent} from '~app/shared/components/select/select.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [SelectComponent],
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  exports: [SelectComponent],
})
export class SelectModule {}
