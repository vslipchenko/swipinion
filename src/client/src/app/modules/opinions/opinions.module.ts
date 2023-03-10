import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OpinionsComponent} from './opinions.component';
import {RouterModule} from '@angular/router';
import {ProgressSpinnerComponent} from '~app/shared/components/progress-spinner/progress-spinner.component';
import {CardComponent} from '~app/shared/components/card/card.component';
import {NgxsModule} from '@ngxs/store';
import {OpinionsState} from '~app/modules/opinions/store/opinions.state';

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
    CardComponent,
    ProgressSpinnerComponent,
    NgxsModule.forFeature([OpinionsState]),
  ],
})
export class OpinionsModule {}
