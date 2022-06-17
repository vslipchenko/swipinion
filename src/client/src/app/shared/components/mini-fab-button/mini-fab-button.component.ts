import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-mini-fab-button',
  templateUrl: './mini-fab-button.component.html',
  styleUrls: ['./mini-fab-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniFabButtonComponent {
  @Input() public color: ThemePalette;
  @Input() public svgIcon = '';
  @Input() public icon = '';
  @Output() public clicked = new EventEmitter();
}
