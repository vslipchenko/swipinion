import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardComponent} from '~app/shared/components/card/card.component';
import {MatIconModule} from '@angular/material/icon';
import {CardStatsModule} from '~app/shared/components/card-stats/card-stats.module';
import {CardTagsModule} from '~app/shared/components/card-tags/card-tags.module';
import {IconButtonModule} from '~app/shared/components/icon-button/icon-button.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule, RouterModule, MatIconModule, CardStatsModule, CardTagsModule, IconButtonModule],
  exports: [CardComponent],
})
export class CardModule {}
