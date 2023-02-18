import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';

@Component({
  selector: 'app-content-placeholder',
  templateUrl: './content-placeholder.component.html',
  styleUrls: ['./content-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, MatIconModule, MatTooltipModule],
})
export class ContentPlaceholderComponent {
  @Input() public icon = '';
  @Input() public svgIcon = '';
  @Input() public text = '';
  @Input() public tip = '';
  @Input() public border = true;
  @Input() public gradient = true;
}
