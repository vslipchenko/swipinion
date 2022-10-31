import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConversationUserSearchComponent} from './conversation-user-search.component';
import {InputModule} from '~app/shared/components/input/input.module';
import {ProgressSpinnerModule} from '~app/shared/components/progress-spinner/progress-spinner.module';
import {InputResetSuffixModule} from '~app/shared/components/input-reset-suffix/input-reset-suffix.module';
import {MessageThumbnailModule} from '~app/shared/components/message-thumbnail/message-thumbnail.module';

@NgModule({
  declarations: [ConversationUserSearchComponent],
  imports: [CommonModule, InputModule, ProgressSpinnerModule, InputResetSuffixModule, MessageThumbnailModule],
  exports: [ConversationUserSearchComponent],
})
export class ConversationUserSearchModule {}
