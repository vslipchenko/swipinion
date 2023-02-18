import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserNotificationsComponent} from './user-notifications.component';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {NgxsModule} from '@ngxs/store';
import {UserNotificationsState} from '~app/modules/user-notifications/store/user-notifications.state';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {UserNotificationComponent} from './components/user-notification/user-notification.component';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {ContentPlaceholderComponent} from '~app/shared/components/content-placeholder/content-placeholder.component';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';
import {MenuItemsModule} from '~app/shared/components/menu-items/menu-items.module';
import {ProgressSpinnerModule} from '~app/shared/components/progress-spinner/progress-spinner.module';
import {InViewModule} from '~app/shared/directives/in-view/in-view.module';

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
    ContentPlaceholderComponent,
    IconButtonComponent,
    MenuItemsModule,
    ProgressSpinnerModule,
    InViewModule,
  ],
})
export class UserNotificationsModule {}
