import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-opinion-stats-panel',
  templateUrl: './opinion-stats-panel.component.html',
  styleUrls: ['./opinion-stats-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgForOf, ButtonComponent],
})
export class OpinionStatsPanelComponent {
  // @Input() public stats: Array<{icon?: string; svgIcon?: string; value: string}> = [];
  @Input() public agreed = '';
  @Input() public disagreed = '';
  @Input() public comments = '';
  @Input() public buttonClass = '';
}
