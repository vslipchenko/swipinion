import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMessagesComponent} from './user-messages.component';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {ProgressBarComponent} from '~app/shared/components/progress-bar/progress-bar.component';
import {MessageListComponent} from '~app/shared/components/message-list/message-list.component';
import {ConversationAccordionComponent} from '~app/shared/components/conversation-accordion/conversation-accordion.component';
import {MessagesDirective} from '~app/shared/directives/messages/messages.directive';
import {ContentPlaceholderComponent} from '~app/shared/components/content-placeholder/content-placeholder.component';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';

@NgModule({
  declarations: [UserMessagesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserMessagesComponent,
      },
    ]),
    MatIconModule,
    ProgressBarComponent,
    MessageListComponent,
    ConversationAccordionComponent,
    MessagesDirective,
    ContentPlaceholderComponent,
    IconButtonComponent,
  ],
})
export class UserMessagesModule {}
