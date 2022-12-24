import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThumbnailComponent} from './thumbnail.component';
import {MatIconModule} from '@angular/material/icon';
import {RouterLinkWithHref} from '@angular/router';

@NgModule({
  declarations: [ThumbnailComponent],
  imports: [CommonModule, MatIconModule, RouterLinkWithHref],
  exports: [ThumbnailComponent],
})
export class ThumbnailModule {}
