import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessageListComponent} from './message-list.component';
import {MessageModule} from '~app/shared/components/message/message.module';
import {ContentPlaceholderComponent} from '~app/shared/components/content-placeholder/content-placeholder.component';
import {ProgressSpinnerComponent} from '~app/shared/components/progress-spinner/progress-spinner.component';
import {InViewDirective} from '~app/shared/directives/in-view/in-view.directive';

@NgModule({
  declarations: [MessageListComponent],
  imports: [CommonModule, MessageModule, ContentPlaceholderComponent, ProgressSpinnerComponent, InViewDirective],
  exports: [MessageListComponent],
})
export class MessageListModule {}
