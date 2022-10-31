import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConversationUserSearchComponent} from './conversation-user-search.component';
import {InputModule} from '~app/shared/components/input/input.module';
import {ProgressSpinnerModule} from '~app/shared/components/progress-spinner/progress-spinner.module';

@NgModule({
  declarations: [ConversationUserSearchComponent],
  imports: [CommonModule, InputModule, ProgressSpinnerModule],
  exports: [ConversationUserSearchComponent],
})
export class ConversationUserSearchModule {}
