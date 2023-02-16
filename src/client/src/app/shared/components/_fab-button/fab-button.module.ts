import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FabButtonComponent} from '~app/shared/components/_fab-button/fab-button.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [FabButtonComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class FabButtonModule {}
