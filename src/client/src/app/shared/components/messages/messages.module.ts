import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessagesComponent} from '~app/shared/components/messages/messages.component';
import {AccordionModule} from '~app/shared/components/accordion/accordion.module';
import {MatIconModule} from '@angular/material/icon';
import {IconButtonModule} from '~app/shared/components/icon-button/icon-button.module';
import {RouterModule} from '@angular/router';
import {MessageModule} from '~app/shared/components/message/message.module';
import {ChatModule} from '~app/shared/components/chat/chat.module';
import {ProgressSpinnerModule} from '~app/shared/components/progress-spinner/progress-spinner.module';

@NgModule({
  declarations: [MessagesComponent],
  imports: [
    CommonModule,
    RouterModule,
    AccordionModule,
    MatIconModule,
    IconButtonModule,
    MessageModule,
    ChatModule,
    ProgressSpinnerModule,
  ],
  exports: [MessagesComponent],
})
export class MessagesModule {}
