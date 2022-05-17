import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-input-reset-suffix',
  templateUrl: './input-reset-suffix.component.html',
  styleUrls: ['./input-reset-suffix.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputResetSuffixComponent {
  @Input() public show = false;

  @Output() public resetValue = new EventEmitter();
}
