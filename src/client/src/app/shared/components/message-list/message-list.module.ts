import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessageListComponent} from './message-list.component';
import {MessageModule} from '~app/shared/components/message/message.module';
import {ContentPlaceholderModule} from '~app/shared/components/content-placeholder/content-placeholder.module';
import {ProgressSpinnerModule} from '~app/shared/components/progress-spinner/progress-spinner.module';
import {InViewModule} from '~app/shared/directives/in-view/in-view.module';

@NgModule({
  declarations: [MessageListComponent],
  imports: [CommonModule, MessageModule, ContentPlaceholderModule, ProgressSpinnerModule, InViewModule],
  exports: [MessageListComponent],
})
export class MessageListModule {}
