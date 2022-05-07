import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecoveryComponent} from './recovery.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [RecoveryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: RecoveryComponent,
      },
    ]),
  ],
})
export class RecoveryModule {}
