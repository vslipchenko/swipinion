import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputComponent} from '~app/shared/components/input/input.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';

@NgModule({
  declarations: [InputComponent],
  imports: [CommonModule, MatInputModule, ReactiveFormsModule],
  exports: [InputComponent],
})
export class InputModule {}
