import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OpinionsComponent} from './opinions.component';
import {RouterModule} from '@angular/router';
import {CardModule} from '~app/shared/components/card/card.module';
import {ProgressSpinnerModule} from '~app/shared/components/progress-spinner/progress-spinner.module';

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
    CardModule,
    ProgressSpinnerModule,
  ],
})
export class OpinionsModule {}
