import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserNotificationsComponent} from './user-notifications.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '~app/shared/shared.module';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [UserNotificationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserNotificationsComponent,
      },
    ]),
    SharedModule,
    MatIconModule,
  ],
})
export class UserNotificationsModule {}
