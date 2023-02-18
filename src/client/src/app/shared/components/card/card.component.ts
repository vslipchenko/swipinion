import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CardStatsModule} from '~app/shared/components/card-stats/card-stats.module';
import {CardTagsModule} from '~app/shared/components/card-tags/card-tags.module';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, MatIconModule, CardStatsModule, CardTagsModule, IconButtonComponent],
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
