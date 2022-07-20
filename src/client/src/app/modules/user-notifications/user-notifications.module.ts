import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserNotificationsComponent} from './user-notifications.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '~app/shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {NgxsModule} from '@ngxs/store';
import {UserNotificationsState} from '~app/modules/user-notifications/store/user-notifications.state';
import {MatMenuModule} from '@angular/material/menu';
import { UserNotificationComponent } from './components/user-notification/user-notification.component';

@NgModule({
  declarations: [UserNotificationsComponent, UserNotificationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserNotificationsComponent,
      },
    ]),
    NgxsModule.forFeature([UserNotificationsState]),
    SharedModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class UserNotificationsModule {}
