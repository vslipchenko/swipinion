import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardStatsComponent} from '~app/shared/components/card-stats/card-stats.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [CardStatsComponent],
  imports: [CommonModule, MatIconModule],
  exports: [CardStatsComponent],
})
export class CardStatsModule {}
