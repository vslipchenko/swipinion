import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignInDialogComponent} from '~app/shared/components/sign-in-dialog/sign-in-dialog.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {InputComponent} from '~app/shared/components/input/input.component';
import {InputHideSuffixComponent} from '~app/shared/components/input-hide-suffix/input-hide-suffix.component';
import {CheckboxComponent} from '~app/shared/components/checkbox/checkbox.component';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';

@NgModule({
  declarations: [SignInDialogComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatDialogModule,
    InputComponent,
    InputHideSuffixComponent,
    CheckboxComponent,
    ProgressBarModule,
    ButtonComponent,
  ],
})
export class SignInDialogModule {}
