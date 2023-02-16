import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-mini-fab-button',
  templateUrl: './mini-fab-button.component.html',
  styleUrls: ['./mini-fab-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
export class MiniFabButtonComponent {
  @Input() public color: ThemePalette;
  @Input() public svgIcon = '';
  @Input() public icon = '';
  @Input() public disabled = false;
  @Output() public clicked = new EventEmitter();
}
