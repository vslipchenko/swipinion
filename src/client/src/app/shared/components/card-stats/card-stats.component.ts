import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-stats',
  templateUrl: './card-stats.component.html',
  styleUrls: ['./card-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardStatsComponent {
  @Input() public stats: Array<{icon?: string; svgIcon?: string; value: number}> = [];
}
