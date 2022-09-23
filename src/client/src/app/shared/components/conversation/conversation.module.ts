import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConversationComponent} from './conversation.component';
import {RouterModule} from '@angular/router';
import {IconButtonModule} from '~app/shared/components/icon-button/icon-button.module';
import {TextareaModule} from '~app/shared/components/textarea/textarea.module';
import {MiniFabButtonModule} from '~app/shared/components/mini-fab-button/mini-fab-button.module';
import {MatIconModule} from '@angular/material/icon';
import {ProgressSpinnerModule} from '~app/shared/components/progress-spinner/progress-spinner.module';

@NgModule({
  declarations: [ConversationComponent],
  exports: [ConversationComponent],
  imports: [
    CommonModule,
    RouterModule,
    IconButtonModule,
    TextareaModule,
    MiniFabButtonModule,
    MatIconModule,
    ProgressSpinnerModule,
  ],
})
export class ConversationModule {}
