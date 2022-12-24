import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlatButtonComponent} from '~app/shared/components/flat-button/flat-button.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [FlatButtonComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [FlatButtonComponent],
})
export class FlatButtonModule {}
