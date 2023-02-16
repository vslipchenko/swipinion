import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileBrowserComponent} from '~app/shared/components/file-browser/file-browser.component';
import {FlatButtonComponent} from '~app/shared/components/flat-button/flat-button.component';

@NgModule({
  declarations: [FileBrowserComponent],
  imports: [CommonModule, FlatButtonComponent],
  exports: [FileBrowserComponent],
})
export class FileBrowserModule {}
