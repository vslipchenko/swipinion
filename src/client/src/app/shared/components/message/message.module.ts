import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessageComponent} from './message.component';
import {ThumbnailComponent} from '~app/shared/components/thumbnail/thumbnail.component';

@NgModule({
  declarations: [MessageComponent],
  exports: [MessageComponent],
  imports: [CommonModule, ThumbnailComponent],
})
export class MessageModule {}
