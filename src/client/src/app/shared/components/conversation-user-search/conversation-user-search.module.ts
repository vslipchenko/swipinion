import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConversationUserSearchComponent} from './conversation-user-search.component';
import {InputComponent} from '~app/shared/components/input/input.component';
import {ProgressSpinnerModule} from '~app/shared/components/progress-spinner/progress-spinner.module';
import {InputResetSuffixComponent} from '~app/shared/components/input-reset-suffix/input-reset-suffix.component';
import {ThumbnailComponent} from '~app/shared/components/thumbnail/thumbnail.component';

@NgModule({
  declarations: [ConversationUserSearchComponent],
  imports: [CommonModule, InputComponent, ProgressSpinnerModule, InputResetSuffixComponent, ThumbnailComponent],
  exports: [ConversationUserSearchComponent],
})
export class ConversationUserSearchModule {}
