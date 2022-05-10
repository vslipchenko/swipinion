import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-fab-button',
  templateUrl: './fab-button.component.html',
  styleUrls: ['./fab-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FabButtonComponent {
  @Input() public color: ThemePalette;
  @Input() public svgIcon = '';
  @Input() public icon = '';
}
