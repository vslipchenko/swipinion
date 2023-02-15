import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardStatsComponent} from '~app/shared/components/card-stats/card-stats.component';
import {MatIconModule} from '@angular/material/icon';
import {ButtonComponent} from '~app/shared/components/button/button.component';

@NgModule({
  declarations: [CardStatsComponent],
  imports: [CommonModule, MatIconModule, ButtonComponent],
  exports: [CardStatsComponent],
})
export class CardStatsModule {}
