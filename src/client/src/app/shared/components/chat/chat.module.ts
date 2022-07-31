import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatComponent} from './chat.component';
import {RouterModule} from '@angular/router';
import {IconButtonModule} from '~app/shared/components/icon-button/icon-button.module';

@NgModule({
  declarations: [ChatComponent],
  exports: [ChatComponent],
  imports: [CommonModule, RouterModule, IconButtonModule],
})
export class ChatModule {}
