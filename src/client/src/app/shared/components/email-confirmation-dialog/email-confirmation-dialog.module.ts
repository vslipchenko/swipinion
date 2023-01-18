import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmailConfirmationDialogComponent} from '~app/shared/components/email-confirmation-dialog/email-confirmation-dialog.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {InputModule} from '~app/shared/components/input/input.module';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {ButtonModule} from '~app/shared/components/button/button.module';

@NgModule({
  declarations: [EmailConfirmationDialogComponent],
  imports: [CommonModule, MatDialogModule, InputModule, ProgressBarModule, ButtonModule],
})
export class EmailConfirmationDialogModule {}
