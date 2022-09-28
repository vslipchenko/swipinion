import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConversationMessageComponent} from './conversation-message.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [ConversationMessageComponent],
  imports: [CommonModule, MatIconModule],
  exports: [ConversationMessageComponent],
})
export class ConversationMessageModule {}
