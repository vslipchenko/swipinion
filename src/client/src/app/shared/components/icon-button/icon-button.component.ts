import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

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
  @Input() public disabled = false;
  @Input() public color: ThemePalette;

  @Output() public clicked = new EventEmitter<MouseEvent>();
}
