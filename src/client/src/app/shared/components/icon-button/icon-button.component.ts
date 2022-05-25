import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  @Input() public svgIcon = '';
  @Input() public icon = '';
  @Input() public extendClass = '';
}
