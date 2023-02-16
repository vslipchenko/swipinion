import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageBrowserComponent} from '~app/shared/components/image-browser/image-browser.component';
import {FlatButtonComponent} from '~app/shared/components/flat-button/flat-button.component';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {FileBrowserModule} from '~app/shared/components/file-browser/file-browser.module';
import {InputModule} from '~app/shared/components/input/input.module';
import {InputResetSuffixModule} from '~app/shared/components/input-reset-suffix/input-reset-suffix.module';

@NgModule({
  declarations: [ImageBrowserComponent],
  imports: [
    CommonModule,
    FlatButtonComponent,
    MatFormFieldModule,
    FileBrowserModule,
    InputModule,
    InputResetSuffixModule,
  ],
  exports: [ImageBrowserComponent],
})
export class ImageBrowserModule {}
