import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmailConfirmationDialogComponent} from '~app/shared/components/email-confirmation-dialog/email-confirmation-dialog.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {InputComponent} from '~app/shared/components/input/input.component';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {ButtonComponent} from '~app/shared/components/button/button.component';

@NgModule({
  declarations: [EmailConfirmationDialogComponent],
  imports: [CommonModule, MatDialogModule, InputComponent, ProgressBarModule, ButtonComponent],
})
export class EmailConfirmationDialogModule {}
