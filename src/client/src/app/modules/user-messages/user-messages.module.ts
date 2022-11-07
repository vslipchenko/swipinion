import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMessagesComponent} from './user-messages.component';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';

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
    MatIconModule,
    ProgressBarModule,
  ],
})
export class UserMessagesModule {}
