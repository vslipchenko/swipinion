import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntryComponent} from './entry.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    EntryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EntryComponent,
      },
    ]),
  ],
})
export class EntryModule {
}
