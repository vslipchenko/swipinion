import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConversationThumbnailComponent} from './conversation-thumbnail.component';
import {ThumbnailComponent} from '~app/shared/components/thumbnail/thumbnail.component';

@NgModule({
  declarations: [ConversationThumbnailComponent],
  imports: [CommonModule, ThumbnailComponent],
  exports: [ConversationThumbnailComponent],
})
export class ConversationThumbnailModule {}
