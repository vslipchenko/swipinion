import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConversationAccordionComponent} from './conversation-accordion.component';
import {AccordionModule} from '~app/shared/components/accordion/accordion.module';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [ConversationAccordionComponent],
  imports: [CommonModule, AccordionModule, MatIconModule],
  exports: [ConversationAccordionComponent],
})
export class ConversationAccordionModule {}
