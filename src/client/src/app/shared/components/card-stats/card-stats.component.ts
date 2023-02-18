import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-card-stats',
  templateUrl: './card-stats.component.html',
  styleUrls: ['./card-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgForOf, ButtonComponent],
})
export class CardStatsComponent {
  @Input() public stats: Array<{icon?: string; svgIcon?: string; value: string}> = [];
}
