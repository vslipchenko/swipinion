import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessageComponent} from './message.component';
import {MessageThumbnailModule} from '~app/shared/components/message-thumbnail/message-thumbnail.module';

@NgModule({
  declarations: [MessageComponent],
  exports: [MessageComponent],
  imports: [CommonModule, MessageThumbnailModule],
})
export class MessageModule {}
