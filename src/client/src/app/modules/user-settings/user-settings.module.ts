import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserSettingsComponent} from './user-settings.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '~app/shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {SettingsAccordionComponent} from './components/settings-accordion/settings-accordion.component';
import {NgxsModule} from '@ngxs/store';
import {UserSettingsState} from '~app/modules/user-settings/store/user-settings.state';

@NgModule({
  declarations: [UserSettingsComponent, SettingsAccordionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserSettingsComponent,
      },
    ]),
    NgxsModule.forFeature([UserSettingsState]),
    SharedModule,
    MatIconModule,
  ],
})
export class UserSettingsModule {}
