import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessageThumbnailComponent} from './message-thumbnail.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [MessageThumbnailComponent],
  imports: [CommonModule, MatIconModule],
  exports: [MessageThumbnailComponent],
})
export class MessageThumbnailModule {}
