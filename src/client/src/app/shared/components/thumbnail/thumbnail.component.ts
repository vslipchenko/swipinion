import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgIf, NgTemplateOutlet} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgTemplateOutlet, MatIconModule, RouterLink],
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
