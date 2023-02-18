import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMessagesComponent} from './user-messages.component';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {MessageListModule} from '~app/shared/components/message-list/message-list.module';
import {ConversationAccordionComponent} from '~app/shared/components/conversation-accordion/conversation-accordion.component';
import {UserMessagesWrapperComponent} from './components/user-messages-wrapper/user-messages-wrapper.component';
import {MessagesDirective} from '~app/shared/directives/messages/messages.directive';
import {ContentPlaceholderComponent} from '~app/shared/components/content-placeholder/content-placeholder.component';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';

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
    ConversationAccordionComponent,
    MessagesDirective,
    ContentPlaceholderComponent,
    IconButtonComponent,
  ],
})
export class UserMessagesModule {}
