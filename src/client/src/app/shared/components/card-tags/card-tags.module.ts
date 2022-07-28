import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardTagsComponent} from '~app/shared/components/card-tags/card-tags.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [CardTagsComponent],
  imports: [CommonModule, RouterModule],
  exports: [CardTagsComponent],
})
export class CardTagsModule {}
