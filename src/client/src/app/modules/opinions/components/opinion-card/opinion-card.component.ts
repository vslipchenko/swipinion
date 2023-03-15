import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';
import {CardStatsComponent} from '~app/shared/components/card-stats/card-stats.component';
import {CardTagsComponent} from '~app/shared/components/card-tags/card-tags.component';
import {OpinionType} from '~app/typings/opinion/opinion.enums';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-opinion-card',
  templateUrl: './opinion-card.component.html',
  styleUrls: ['./opinion-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, IconButtonComponent, CardStatsComponent, CardTagsComponent],
})
export class OpinionCardComponent {
  @Input() public id = '';
  @Input() public username = '';
  @Input() public title = '';
  @Input() public type = OpinionType.Text;
  @Input() public fileUrl = '';
  @Input() public description = '';
  @Input() public agreed = '';
  @Input() public disagreed = '';
  @Input() public comments = '';
  @Input() public tags: Array<string> = [];

  protected stats = [];
}
