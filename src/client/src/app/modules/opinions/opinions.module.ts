import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OpinionsComponent} from './opinions.component';
import {RouterModule} from '@angular/router';
import {ProgressSpinnerComponent} from '~app/shared/components/progress-spinner/progress-spinner.component';
import {NgxsModule} from '@ngxs/store';
import {OpinionsState} from '~app/modules/opinions/store/opinions.state';
import {OpinionPlaceholderComponent} from '~app/shared/components/opinion-placeholder/opinion-placeholder.component';
import {OpinionCarouselComponent} from '~app/modules/opinions/components/opinion-carousel/opinion-carousel.component';

@NgModule({
  declarations: [OpinionsComponent],
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
    OpinionCarouselComponent,
  ],
})
export class OpinionsModule {}
