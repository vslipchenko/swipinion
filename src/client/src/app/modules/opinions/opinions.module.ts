import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OpinionsComponent} from './opinions.component';
import {RouterModule} from '@angular/router';
import {CardModule} from '~app/shared/components/card/card.module';

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
  ],
})
export class OpinionsModule {}
