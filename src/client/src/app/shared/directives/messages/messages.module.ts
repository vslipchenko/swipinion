import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MessagesDirective } from './messages.directive';

@NgModule({
  declarations: [
    MessagesDirective
  ],
  imports: [CommonModule],
})
export class MessagesModule {}
