import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {UserState} from '~app/modules/user/store/user.state';
import {EditProfileDialogComponent} from './components/edit-profile-dialog/edit-profile-dialog.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatIconModule} from '@angular/material/icon';
import {ProfileActionBarComponent} from './components/profile-action-bar/profile-action-bar.component';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {StatisticsActionComponent} from './components/statistics-action/statistics-action.component';
import {UnfollowUserDialogComponent} from './components/unfollow-user-dialog/unfollow-user-dialog.component';
import {UserOpinionsTabComponent} from './components/user-opinions-tab/user-opinions-tab.component';
import {UserReactionsTabComponent} from './components/user-reactions-tab/user-reactions-tab.component';
import {UserFavoritesTabComponent} from './components/user-favorites-tab/user-favorites-tab.component';
import {MiniFabButtonModule} from '~app/shared/components/mini-fab-button/mini-fab-button.module';
import {TabsModule} from '~app/shared/components/tabs/tabs.module';
import {ContentPlaceholderModule} from '~app/shared/components/content-placeholder/content-placeholder.module';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {ProgressSpinnerModule} from '~app/shared/components/progress-spinner/progress-spinner.module';
import {OpinionPreviewModule} from '~app/shared/components/opinion-preview/opinion-preview.module';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {IconButtonModule} from '~app/shared/components/icon-button/icon-button.module';
import {MenuItemsModule} from '~app/shared/components/menu-items/menu-items.module';
import {AuthClickModule} from '~app/shared/directives/auth-click/auth-click.module';
import {ImageBrowserModule} from '~app/shared/components/image-browser/image-browser.module';
import {TextareaModule} from '~app/shared/components/textarea/textarea.module';
import {InViewModule} from '~app/shared/directives/in-view/in-view.module';

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
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MiniFabButtonModule,
    TabsModule,
    ContentPlaceholderModule,
    ButtonComponent,
    ProgressSpinnerModule,
    OpinionPreviewModule,
    ProgressBarModule,
    IconButtonModule,
    MenuItemsModule,
    AuthClickModule,
    ImageBrowserModule,
    TextareaModule,
    InViewModule,
  ],
  exports: [],
})
export class UserModule {}
