import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessagesPanelComponent} from './messages-panel.component';
import {ConversationAccordionComponent} from '~app/shared/components/conversation-accordion/conversation-accordion.component';
import {MessagesComponent} from '~app/shared/components/messages/messages.component';
import {MessagesDirective} from '~app/shared/directives/messages/messages.directive';

@NgModule({
  declarations: [MessagesPanelComponent],
  imports: [CommonModule, ConversationAccordionComponent, MessagesComponent, MessagesDirective],
  exports: [MessagesPanelComponent],
})
export class MessagesPanelModule {}
