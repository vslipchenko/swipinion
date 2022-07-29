import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntryComponent} from './entry.component';
import {RouterModule} from '@angular/router';
import {CardModule} from '~app/shared/components/card/card.module';

@NgModule({
  declarations: [EntryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EntryComponent,
      },
    ]),
    CardModule,
  ],
})
export class EntryModule {}
