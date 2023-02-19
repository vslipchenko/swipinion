import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessagesComponent} from '~app/shared/components/messages/messages.component';
import {AccordionComponent} from '~app/shared/components/accordion/accordion.component';
import {MatIconModule} from '@angular/material/icon';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';
import {RouterModule} from '@angular/router';
import {ProgressSpinnerComponent} from '~app/shared/components/progress-spinner/progress-spinner.component';
import {MessageListComponent} from '~app/shared/components/message-list/message-list.component';

@NgModule({
  declarations: [MessagesComponent],
  imports: [
    CommonModule,
    RouterModule,
    AccordionComponent,
    MatIconModule,
    IconButtonComponent,
    ProgressSpinnerComponent,
    MessageListComponent,
  ],
  exports: [MessagesComponent],
})
export class MessagesModule {}
