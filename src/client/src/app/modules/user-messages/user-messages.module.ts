import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMessagesComponent} from './user-messages.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [UserMessagesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserMessagesComponent,
      },
    ]),
  ],
})
export class UserMessagesModule {}
