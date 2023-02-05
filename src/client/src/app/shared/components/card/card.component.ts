import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
