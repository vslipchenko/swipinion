import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddOpinionDialogComponent} from '~app/shared/components/add-opinion-dialog/add-opinion-dialog.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {SelectModule} from '~app/shared/components/select/select.module';
import {ImageBrowserModule} from '~app/shared/components/image-browser/image-browser.module';
import {InputModule} from '~app/shared/components/input/input.module';
import {TextareaModule} from '~app/shared/components/textarea/textarea.module';
import {ChipsModule} from '~app/shared/components/chips/chips.module';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {ButtonModule} from '~app/shared/components/button/button.module';

@NgModule({
  declarations: [AddOpinionDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    SelectModule,
    ImageBrowserModule,
    InputModule,
    TextareaModule,
    ChipsModule,
    ProgressBarModule,
    ButtonModule,
  ],
})
export class AddOpinionDialogModule {}
