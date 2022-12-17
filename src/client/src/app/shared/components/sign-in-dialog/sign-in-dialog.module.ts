import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignInDialogComponent} from '~app/shared/components/sign-in-dialog/sign-in-dialog.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {InputModule} from '~app/shared/components/input/input.module';
import {InputHideSuffixModule} from '~app/shared/components/input-hide-suffix/input-hide-suffix.module';
import {CheckboxModule} from '~app/shared/components/checkbox/checkbox.module';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {ButtonModule} from '~app/shared/components/button/button.module';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';

@NgModule({
  declarations: [SignInDialogComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatDialogModule,
    InputModule,
    InputHideSuffixModule,
    CheckboxModule,
    ProgressBarModule,
    ButtonModule,
  ],
})
export class SignInDialogModule {}
