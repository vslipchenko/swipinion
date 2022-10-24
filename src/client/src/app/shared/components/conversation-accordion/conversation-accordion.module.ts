import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConversationAccordionComponent} from './conversation-accordion.component';
import {AccordionModule} from '~app/shared/components/accordion/accordion.module';
import {MatIconModule} from '@angular/material/icon';
import {MessageThumbnailModule} from '~app/shared/components/message-thumbnail/message-thumbnail.module';
import {IconButtonModule} from '~app/shared/components/icon-button/icon-button.module';

@NgModule({
  declarations: [ConversationAccordionComponent],
  imports: [CommonModule, AccordionModule, MatIconModule, MessageThumbnailModule, IconButtonModule],
  exports: [ConversationAccordionComponent],
})
export class ConversationAccordionModule {}
