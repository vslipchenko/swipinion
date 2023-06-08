import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OpinionsComponent} from './opinions.component';
import {RouterModule} from '@angular/router';
import {ProgressSpinnerComponent} from '~app/shared/components/progress-spinner/progress-spinner.component';
import {NgxsModule} from '@ngxs/store';
import {OpinionsState} from '~app/modules/opinions/store/opinions.state';
import {OpinionPlaceholderComponent} from '~app/shared/components/opinion-placeholder/opinion-placeholder.component';
import {OpinionCarouselComponent} from '~app/modules/opinions/components/opinion-carousel/opinion-carousel.component';
import {CommentDialogComponent} from './components/comment-dialog/comment-dialog.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {OpinionCardComponent} from '~app/modules/opinions/components/opinion-card/opinion-card.component';
import {TextBackgroundFillerComponent} from '~app/modules/opinions/components/text-background-filler/text-background-filler.component';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';
import {AuthClickDirective} from '~app/shared/directives/auth-click/auth-click.directive';
import {OpinionStatsPanelComponent} from '~app/shared/components/opinion-stats-panel/opinion-stats-panel.component';
import {CardTagsComponent} from '~app/shared/components/card-tags/card-tags.component';
import {TextareaComponent} from '~app/shared/components/textarea/textarea.component';
import {ProgressBarComponent} from '~app/shared/components/progress-bar/progress-bar.component';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {MatLegacyMenuModule} from '@angular/material/legacy-menu';
import {MenuItemsComponent} from '~app/shared/components/menu-items/menu-items.component';
import {OpinionFailSnackbarComponent} from './components/opinion-fail-snackbar/opinion-fail-snackbar.component';
import {ThumbnailComponent} from '~app/shared/components/thumbnail/thumbnail.component';

@NgModule({
  declarations: [
    OpinionsComponent,
    OpinionCardComponent,
    OpinionCarouselComponent,
    TextBackgroundFillerComponent,
    CommentDialogComponent,
    OpinionFailSnackbarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: OpinionsComponent,
      },
    ]),
    ProgressSpinnerComponent,
    NgxsModule.forFeature([OpinionsState]),
    OpinionPlaceholderComponent,
    MatDialogModule,
    IconButtonComponent,
    AuthClickDirective,
    OpinionStatsPanelComponent,
    CardTagsComponent,
    TextareaComponent,
    ProgressBarComponent,
    ButtonComponent,
    MatLegacyMenuModule,
    MenuItemsComponent,
    ThumbnailComponent,
  ],
})
export class OpinionsModule {}
