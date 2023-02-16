import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessagesComponent} from '~app/shared/components/messages/messages.component';
import {AccordionModule} from '~app/shared/components/accordion/accordion.module';
import {MatIconModule} from '@angular/material/icon';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';
import {RouterModule} from '@angular/router';
import {ProgressSpinnerModule} from '~app/shared/components/progress-spinner/progress-spinner.module';
import {MessageListModule} from '~app/shared/components/message-list/message-list.module';

@NgModule({
  declarations: [MessagesComponent],
  imports: [
    CommonModule,
    RouterModule,
    AccordionModule,
    MatIconModule,
    IconButtonComponent,
    ProgressSpinnerModule,
    MessageListModule,
  ],
  exports: [MessagesComponent],
})
export class MessagesModule {}
