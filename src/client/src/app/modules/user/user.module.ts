import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '~app/shared/shared.module';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserComponent,
      },
    ]),
    SharedModule,
  ],
})
export class UserModule {}
