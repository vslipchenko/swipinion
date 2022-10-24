import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-message-thumbnail',
  templateUrl: './message-thumbnail.component.html',
  styleUrls: ['./message-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageThumbnailComponent {
  // @Input() public svgIcon = '';
  // @Input() public iconColor: ThemePalette;
  @Input() public icon = '';
  @Input() public iconClass = '';
  @Input() public thumbnailClass = '';
  @Input() public thumbnail = '';
}
