import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardStatsComponent} from '~app/shared/components/card-stats/card-stats.component';
import {MatIconModule} from '@angular/material/icon';
import {ButtonModule} from '~app/shared/components/button/button.module';

@NgModule({
  declarations: [CardStatsComponent],
  imports: [CommonModule, MatIconModule, ButtonModule],
  exports: [CardStatsComponent],
})
export class CardStatsModule {}
