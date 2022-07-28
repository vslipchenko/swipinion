import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileBrowserComponent} from '~app/shared/components/file-browser/file-browser.component';
import {FlatButtonModule} from '~app/shared/components/flat-button/flat-button.module';

@NgModule({
  declarations: [FileBrowserComponent],
  imports: [CommonModule, FlatButtonModule],
  exports: [FileBrowserComponent],
})
export class FileBrowserModule {}
