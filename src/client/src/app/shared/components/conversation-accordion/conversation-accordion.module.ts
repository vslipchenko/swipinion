import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConversationAccordionComponent} from './conversation-accordion.component';
import {AccordionModule} from '~app/shared/components/accordion/accordion.module';
import {IconButtonModule} from '~app/shared/components/icon-button/icon-button.module';
import {ConversationModule} from '~app/shared/components/conversation/conversation.module';
import {ConversationThumbnailModule} from '~app/shared/components/conversation-thumbnail/conversation-thumbnail.module';
import {ConversationUserSearchModule} from '~app/shared/components/conversation-user-search/conversation-user-search.module';

@NgModule({
  declarations: [ConversationAccordionComponent],
  imports: [
    CommonModule,
    AccordionModule,
    IconButtonModule,
    ConversationModule,
    ConversationThumbnailModule,
    ConversationUserSearchModule,
  ],
  exports: [ConversationAccordionComponent],
})
export class ConversationAccordionModule {}
