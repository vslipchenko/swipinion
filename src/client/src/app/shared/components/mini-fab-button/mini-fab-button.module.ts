import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MiniFabButtonComponent} from '~app/shared/components/mini-fab-button/mini-fab-button.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [MiniFabButtonComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [MiniFabButtonComponent],
})
export class MiniFabButtonModule {}
