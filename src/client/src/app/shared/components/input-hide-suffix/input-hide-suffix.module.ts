import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputHideSuffixComponent} from '~app/shared/components/input-hide-suffix/input-hide-suffix.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [InputHideSuffixComponent],
  imports: [CommonModule, MatIconModule],
  exports: [InputHideSuffixComponent],
})
export class InputHideSuffixModule {}
