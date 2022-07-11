import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-flat-button',
  templateUrl: './flat-button.component.html',
  styleUrls: ['./flat-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatButtonComponent {
  @Input() public text = '';
  @Input() public extendClass = '';
  @Input() public svgIcon = '';
  @Input() public icon = '';
  @Input() public disabled = false;
  @Input() public color: ThemePalette;

  @Output() public clicked = new EventEmitter<void>();
}
