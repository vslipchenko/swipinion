import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {InputComponent} from '~app/shared/components/input/input.component';

@Component({
  selector: 'app-input-hide-suffix',
  templateUrl: './input-hide-suffix.component.html',
  styleUrls: ['./input-hide-suffix.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputHideSuffixComponent {
  @Input() public input!: InputComponent;
}
