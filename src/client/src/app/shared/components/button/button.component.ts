import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, MatButtonModule, MatIconModule],
})
export class ButtonComponent {
  @Input() public text = '';
  @Input() public extendClass = '';
  @Input() public iconClass = '';
  @Input() public icon = '';
  @Input() public svgIcon = '';
  @Input() public color: ThemePalette;
  @Input() public disabled = false;

  @Output() public clicked = new EventEmitter<void>();
}
