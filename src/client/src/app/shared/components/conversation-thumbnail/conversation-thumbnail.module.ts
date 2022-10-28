import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConversationThumbnailComponent} from './conversation-thumbnail.component';
import {MessageThumbnailModule} from '~app/shared/components/message-thumbnail/message-thumbnail.module';

@NgModule({
  declarations: [ConversationThumbnailComponent],
  imports: [CommonModule, MessageThumbnailModule],
  exports: [ConversationThumbnailComponent],
})
export class ConversationThumbnailModule {}
