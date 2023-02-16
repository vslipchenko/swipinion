import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
export class IconButtonComponent {
  @Input() public svgIcon = '';
  @Input() public icon = '';
  @Input() public extendClass = '';
  @Input() public disabled = false;
  @Input() public color: ThemePalette;

  @Output() public clicked = new EventEmitter<MouseEvent>();
}
