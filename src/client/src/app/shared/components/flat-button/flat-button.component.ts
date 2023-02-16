import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-flat-button',
  templateUrl: './flat-button.component.html',
  styleUrls: ['./flat-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, MatButtonModule, MatIconModule],
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
