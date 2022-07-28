import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputResetSuffixComponent} from '~app/shared/components/input-reset-suffix/input-reset-suffix.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [InputResetSuffixComponent],
  imports: [CommonModule, MatIconModule],
  exports: [InputResetSuffixComponent],
})
export class InputResetSuffixModule {}
