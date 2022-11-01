import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConversationThumbnailComponent} from './conversation-thumbnail.component';
import {ThumbnailModule} from '~app/shared/components/thumbnail/thumbnail.module';

@NgModule({
  declarations: [ConversationThumbnailComponent],
  imports: [CommonModule, ThumbnailModule],
  exports: [ConversationThumbnailComponent],
})
export class ConversationThumbnailModule {}
