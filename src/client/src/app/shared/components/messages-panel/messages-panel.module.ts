import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessagesPanelComponent} from './messages-panel.component';
import {ConversationAccordionComponent} from '~app/shared/components/conversation-accordion/conversation-accordion.component';
import {MessagesModule} from '~app/shared/components/messages/messages.module';
import {MessagesDirectiveModule} from '~app/shared/directives/messages/messages.module';

@NgModule({
  declarations: [MessagesPanelComponent],
  imports: [CommonModule, ConversationAccordionComponent, MessagesModule, MessagesDirectiveModule],
  exports: [MessagesPanelComponent],
})
export class MessagesPanelModule {}
