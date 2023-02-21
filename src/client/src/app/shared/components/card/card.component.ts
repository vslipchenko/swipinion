import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CardStatsComponent} from '~app/shared/components/card-stats/card-stats.component';
import {CardTagsComponent} from '~app/shared/components/card-tags/card-tags.component';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, CardStatsComponent, CardTagsComponent, IconButtonComponent],
})
export class CardComponent {
  @Input() public backgroundThumbnail = '';

  public readonly stats = [
    {icon: 'thumb_up', value: '12'},
    {icon: 'thumb_down', value: '10'},
    // {icon: 'chat_bubble', value: 10},
    {svgIcon: 'comment-outline', value: '10'},
    // {icon: 'visibility', value: 14},
  ];
}
