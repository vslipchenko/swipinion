import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatComponent} from './chat.component';
import {RouterModule} from '@angular/router';
import {IconButtonModule} from '~app/shared/components/icon-button/icon-button.module';
import {TextareaModule} from '~app/shared/components/textarea/textarea.module';
import {MiniFabButtonModule} from '~app/shared/components/mini-fab-button/mini-fab-button.module';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [ChatComponent],
  exports: [ChatComponent],
  imports: [CommonModule, RouterModule, IconButtonModule, TextareaModule, MiniFabButtonModule, MatIconModule],
})
export class ChatModule {}
