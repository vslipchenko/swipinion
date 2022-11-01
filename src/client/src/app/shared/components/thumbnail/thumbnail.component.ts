import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThumbnailComponent {
  // @Input() public svgIcon = '';
  // @Input() public iconColor: ThemePalette;
  @Input() public icon = '';
  @Input() public iconClass = '';
  @Input() public thumbnailClass = '';
  @Input() public thumbnail = '';
  @Input() public thumbnailLink = '';
}
