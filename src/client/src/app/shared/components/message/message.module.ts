import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessageComponent} from './message.component';
import {ThumbnailModule} from '~app/shared/components/thumbnail/thumbnail.module';

@NgModule({
  declarations: [MessageComponent],
  exports: [MessageComponent],
  imports: [CommonModule, ThumbnailModule],
})
export class MessageModule {}
