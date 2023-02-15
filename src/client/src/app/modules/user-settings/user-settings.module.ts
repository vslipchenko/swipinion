import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserSettingsComponent} from './user-settings.component';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {SettingsAccordionComponent} from './components/settings-accordion/settings-accordion.component';
import {NgxsModule} from '@ngxs/store';
import {UserSettingsState} from '~app/modules/user-settings/store/user-settings.state';
import {AccordionModule} from '~app/shared/components/accordion/accordion.module';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {InputModule} from '~app/shared/components/input/input.module';
import {InputHideSuffixModule} from '~app/shared/components/input-hide-suffix/input-hide-suffix.module';
import {RadioGroupModule} from '~app/shared/components/radio-group/radio-group.module';
import {FlatButtonModule} from '~app/shared/components/flat-button/flat-button.module';

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
    MatIconModule,
    AccordionModule,
    ButtonComponent,
    ProgressBarModule,
    InputModule,
    InputHideSuffixModule,
    RadioGroupModule,
    FlatButtonModule,
  ],
})
export class UserSettingsModule {}
