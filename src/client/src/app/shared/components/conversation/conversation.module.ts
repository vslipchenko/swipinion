import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConversationComponent} from './conversation.component';
import {IconButtonModule} from '~app/shared/components/icon-button/icon-button.module';
import {TextareaModule} from '~app/shared/components/textarea/textarea.module';
import {MiniFabButtonModule} from '~app/shared/components/mini-fab-button/mini-fab-button.module';
import {ProgressSpinnerModule} from '~app/shared/components/progress-spinner/progress-spinner.module';
import {InViewModule} from '~app/shared/directives/in-view/in-view.module';
import {ConversationMessageModule} from '~app/shared/components/conversation-message/conversation-message.module';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';

@NgModule({
  declarations: [ConversationComponent],
  exports: [ConversationComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    TextareaModule,
    MiniFabButtonModule,
    ProgressSpinnerModule,
    InViewModule,
    ConversationMessageModule,
    ProgressBarModule,
  ],
})
export class ConversationModule {}
