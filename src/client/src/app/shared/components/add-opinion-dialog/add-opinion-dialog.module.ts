import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddOpinionDialogComponent} from '~app/shared/components/add-opinion-dialog/add-opinion-dialog.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {InputComponent} from '~app/shared/components/input/input.component';
import {TextareaComponent} from '~app/shared/components/textarea/textarea.component';
import {ChipsModule} from '~app/shared/components/chips/chips.module';
import {ProgressBarModule} from '~app/shared/components/progress-bar/progress-bar.module';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {ImageBrowserModule} from '~app/shared/components/image-browser/image-browser.module';

@NgModule({
  declarations: [AddOpinionDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    InputComponent,
    TextareaComponent,
    ChipsModule,
    ProgressBarModule,
    ButtonComponent,
    ImageBrowserModule,
  ],
})
export class AddOpinionDialogModule {}
