import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [ButtonComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [ButtonComponent],
})
export class ButtonModule {}
