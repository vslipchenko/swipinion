import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntryComponent} from './entry.component';
import {RouterModule} from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import {CardModule} from '~app/shared/components/card/card.module';
import {InputModule} from '~app/shared/components/input/input.module';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {ButtonModule} from '~app/shared/components/button/button.module';
import {InputHideSuffixModule} from '~app/shared/components/input-hide-suffix/input-hide-suffix.module';
import {CheckboxModule} from '~app/shared/components/checkbox/checkbox.module';

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
    MatDialogModule,
    CardModule,
    InputModule,
    ProgressBarModule,
    ButtonModule,
    InputHideSuffixModule,
    CheckboxModule,
  ],
})
export class EntryModule {}
