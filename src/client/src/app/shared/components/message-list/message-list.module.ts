import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessageListComponent} from './message-list.component';
import {MessageModule} from '~app/shared/components/message/message.module';
import {ContentPlaceholderComponent} from '~app/shared/components/content-placeholder/content-placeholder.component';
import {ProgressSpinnerModule} from '~app/shared/components/progress-spinner/progress-spinner.module';
import {InViewDirective} from '~app/shared/directives/in-view/in-view.directive';

@NgModule({
  declarations: [MessageListComponent],
  imports: [CommonModule, MessageModule, ContentPlaceholderComponent, ProgressSpinnerModule, InViewDirective],
  exports: [MessageListComponent],
})
export class MessageListModule {}
