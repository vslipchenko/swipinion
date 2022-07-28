import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserNotificationsComponent} from './user-notifications.component';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {NgxsModule} from '@ngxs/store';
import {UserNotificationsState} from '~app/modules/user-notifications/store/user-notifications.state';
import {MatMenuModule} from '@angular/material/menu';
import {UserNotificationComponent} from './components/user-notification/user-notification.component';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {ContentPlaceholderModule} from '~app/shared/components/content-placeholder/content-placeholder.module';
import {IconButtonModule} from '~app/shared/components/icon-button/icon-button.module';
import {MenuItemsModule} from '~app/shared/components/menu-items/menu-items.module';

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
    MatIconModule,
    MatMenuModule,
    ProgressBarModule,
    ContentPlaceholderModule,
    IconButtonModule,
    MenuItemsModule,
  ],
})
export class UserNotificationsModule {}
