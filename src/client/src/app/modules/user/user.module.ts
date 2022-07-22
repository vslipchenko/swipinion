import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '~app/shared/shared.module';
import {NgxsModule} from '@ngxs/store';
import {UserState} from '~app/modules/user/store/user.state';
import {EditProfileDialogComponent} from './components/edit-profile-dialog/edit-profile-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {ProfileActionBarComponent} from './components/profile-action-bar/profile-action-bar.component';
import {MatMenuModule} from '@angular/material/menu';
import {StatisticsActionComponent} from './components/statistics-action/statistics-action.component';
import {UnfollowUserDialogComponent} from './components/unfollow-user-dialog/unfollow-user-dialog.component';
import { UserOpinionsTabComponent } from './components/user-opinions-tab/user-opinions-tab.component';
import { UserReactionsTabComponent } from './components/user-reactions-tab/user-reactions-tab.component';
import { UserFavoritesTabComponent } from './components/user-favorites-tab/user-favorites-tab.component';

@NgModule({
  declarations: [
    UserComponent,
    EditProfileDialogComponent,
    ProfileActionBarComponent,
    StatisticsActionComponent,
    UnfollowUserDialogComponent,
    UserOpinionsTabComponent,
    UserReactionsTabComponent,
    UserFavoritesTabComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserComponent,
      },
    ]),
    NgxsModule.forFeature([UserState]),
    SharedModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
  ],
  exports: [],
})
export class UserModule {}
