import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlatButtonComponent} from '~app/shared/components/flat-button/flat-button.component';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [FlatButtonComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [FlatButtonComponent],
})
export class FlatButtonModule {}
