import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessageDialogComponent} from '~app/shared/components/message-dialog/message-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {ButtonModule} from '~app/shared/components/button/button.module';
import {TextareaModule} from '~app/shared/components/textarea/textarea.module';

@NgModule({
  declarations: [MessageDialogComponent],
  imports: [CommonModule, MatDialogModule, ProgressBarModule, ButtonModule, TextareaModule],
})
export class MessageDialogModule {}
