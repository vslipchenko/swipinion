import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-input-reset-suffix',
  templateUrl: './input-reset-suffix.component.html',
  styleUrls: ['./input-reset-suffix.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, NgIf],
  standalone: true,
})
export class InputResetSuffixComponent {
  @Input() public show = false;

  @Output() public resetValue = new EventEmitter();
}
