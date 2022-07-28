import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessagesComponent} from '~app/shared/components/messages/messages.component';
import {AccordionModule} from '~app/shared/components/accordion/accordion.module';
import {MatIconModule} from '@angular/material/icon';
import {IconButtonModule} from '~app/shared/components/icon-button/icon-button.module';
import {TabsModule} from '~app/shared/components/tabs/tabs.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [MessagesComponent],
  imports: [CommonModule, RouterModule, AccordionModule, MatIconModule, IconButtonModule, TabsModule],
  exports: [MessagesComponent],
})
export class MessagesModule {}
