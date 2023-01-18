import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChipsComponent} from '~app/shared/components/chips/chips.component';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [ChipsComponent],
  imports: [CommonModule, MatFormFieldModule, MatChipsModule, MatIconModule],
  exports: [ChipsComponent],
})
export class ChipsModule {}
