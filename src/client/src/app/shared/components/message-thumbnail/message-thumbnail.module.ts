import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessageThumbnailComponent} from './message-thumbnail.component';
import {MatIconModule} from '@angular/material/icon';
import {RouterLinkWithHref} from '@angular/router';

@NgModule({
  declarations: [MessageThumbnailComponent],
  imports: [CommonModule, MatIconModule, RouterLinkWithHref],
  exports: [MessageThumbnailComponent],
})
export class MessageThumbnailModule {}
