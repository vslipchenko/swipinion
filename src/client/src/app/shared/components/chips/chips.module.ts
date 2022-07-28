import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChipsComponent} from '~app/shared/components/chips/chips.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [ChipsComponent],
  imports: [CommonModule, MatFormFieldModule, MatChipsModule, MatIconModule],
  exports: [ChipsComponent],
})
export class ChipsModule {}
