import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntryComponent} from './entry.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '~app/shared/shared.module';
import {SignInDialogComponent} from './components/sign-in-dialog/sign-in-dialog.component';
import {SignUpDialogComponent} from './components/sign-up-dialog/sign-up-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { RecoveryDialogComponent } from './components/recovery-dialog/recovery-dialog.component';
import { EmailConfirmationDialogComponent } from './components/email-confirmation-dialog/email-confirmation-dialog.component';

@NgModule({
  declarations: [EntryComponent, SignInDialogComponent, SignUpDialogComponent, RecoveryDialogComponent, EmailConfirmationDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EntryComponent,
      },
    ]),
    SharedModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
})
export class EntryModule {}
