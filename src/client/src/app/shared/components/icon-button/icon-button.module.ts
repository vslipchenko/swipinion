import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [IconButtonComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [IconButtonComponent],
})
export class IconButtonModule {}
