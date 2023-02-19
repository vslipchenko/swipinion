import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OpinionsComponent} from './opinions.component';
import {RouterModule} from '@angular/router';
import {ProgressSpinnerComponent} from '~app/shared/components/progress-spinner/progress-spinner.component';
import {CardComponent} from '~app/shared/components/card/card.component';

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
  ],
})
export class OpinionsModule {}
