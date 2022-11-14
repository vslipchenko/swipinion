import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMessagesComponent} from './user-messages.component';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {MessageListModule} from '~app/shared/components/message-list/message-list.module';
import {ConversationAccordionModule} from '~app/shared/components/conversation-accordion/conversation-accordion.module';
import {UserMessagesWrapperComponent} from './components/user-messages-wrapper/user-messages-wrapper.component';
import {MessagesDirectiveModule} from '~app/shared/directives/messages/messages.module';
import {ContentPlaceholderModule} from '~app/shared/components/content-placeholder/content-placeholder.module';

@NgModule({
  declarations: [UserMessagesComponent, UserMessagesWrapperComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserMessagesComponent,
      },
    ]),
    MatIconModule,
    ProgressBarModule,
    MessageListModule,
    ConversationAccordionModule,
    MessagesDirectiveModule,
    ContentPlaceholderModule,
  ],
})
export class UserMessagesModule {}
