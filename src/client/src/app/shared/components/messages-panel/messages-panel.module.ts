import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessagesPanelComponent} from './messages-panel.component';
import {ConversationAccordionModule} from '~app/shared/components/conversation-accordion/conversation-accordion.module';
import {MessagesModule} from '~app/shared/components/messages/messages.module';

@NgModule({
  declarations: [MessagesPanelComponent],
  imports: [CommonModule, ConversationAccordionModule, MessagesModule],
  exports: [MessagesPanelComponent],
})
export class MessagesPanelModule {}
