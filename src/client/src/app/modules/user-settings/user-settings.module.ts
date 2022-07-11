import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserSettingsComponent} from './user-settings.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '~app/shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {SettingsAccordionComponent} from './components/settings-accordion/settings-accordion.component';

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
    SharedModule,
    MatIconModule,
  ],
})
export class UserSettingsModule {}
