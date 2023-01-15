import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddOpinionDialogComponent} from '~app/shared/components/add-opinion-dialog/add-opinion-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {SelectModule} from '~app/shared/components/select/select.module';
import {InputModule} from '~app/shared/components/input/input.module';
import {TextareaModule} from '~app/shared/components/textarea/textarea.module';
import {ChipsModule} from '~app/shared/components/chips/chips.module';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {ButtonModule} from '~app/shared/components/button/button.module';
import {ImageBrowserModule} from '~app/shared/components/image-browser/image-browser.module';

@NgModule({
  declarations: [AddOpinionDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    SelectModule,
    InputModule,
    TextareaModule,
    ChipsModule,
    ProgressBarModule,
    ButtonModule,
    ImageBrowserModule,
  ],
})
export class AddOpinionDialogModule {}
