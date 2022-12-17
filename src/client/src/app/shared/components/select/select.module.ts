import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectComponent} from '~app/shared/components/select/select.component';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [SelectComponent],
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  exports: [SelectComponent],
})
export class SelectModule {}
