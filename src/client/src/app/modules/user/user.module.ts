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
import {MiniFabButtonComponent} from '~app/shared/components/mini-fab-button/mini-fab-button.component';
import {TabsComponent} from '~app/shared/components/tabs/tabs.component';
import {ContentPlaceholderComponent} from '~app/shared/components/content-placeholder/content-placeholder.component';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {ProgressSpinnerComponent} from '~app/shared/components/progress-spinner/progress-spinner.component';
import {OpinionPreviewComponent} from '~app/shared/components/opinion-preview/opinion-preview.component';
import {ProgressBarComponent} from '~app/shared/components/progress-bar/progress-bar.component';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';
import {MenuItemsComponent} from '~app/shared/components/menu-items/menu-items.component';
import {AuthClickDirective} from '~app/shared/directives/auth-click/auth-click.directive';
import {ImageBrowserComponent} from '~app/shared/components/image-browser/image-browser.component';
import {TextareaComponent} from '~app/shared/components/textarea/textarea.component';
import {InViewDirective} from '~app/shared/directives/in-view/in-view.directive';
import {ThumbnailComponent} from '~app/shared/components/thumbnail/thumbnail.component';
import {UserImageComponent} from '~app/shared/components/user-image/user-image.component';

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
    MiniFabButtonComponent,
    TabsComponent,
    ContentPlaceholderComponent,
    ButtonComponent,
    ProgressSpinnerComponent,
    OpinionPreviewComponent,
    ProgressBarComponent,
    IconButtonComponent,
    MenuItemsComponent,
    AuthClickDirective,
    ImageBrowserComponent,
    TextareaComponent,
    InViewDirective,
    ThumbnailComponent,
    UserImageComponent,
  ],
  exports: [],
})
export class UserModule {}
