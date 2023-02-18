import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignUpDialogComponent} from '~app/shared/components/sign-up-dialog/sign-up-dialog.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {InputComponent} from '~app/shared/components/input/input.component';
import {InputHideSuffixModule} from '~app/shared/components/input-hide-suffix/input-hide-suffix.module';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';

@NgModule({
  declarations: [SignUpDialogComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatDialogModule,
    InputComponent,
    InputHideSuffixModule,
    ProgressBarModule,
    ButtonComponent,
  ],
})
export class SignUpDialogModule {}
