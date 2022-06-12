import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '~app/shared/shared.module';
import {NgxsModule} from '@ngxs/store';
import {UserState} from '~app/modules/user/store/user.state';

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
    NgxsModule.forFeature([UserState]),
    SharedModule,
  ],
})
export class UserModule {}
