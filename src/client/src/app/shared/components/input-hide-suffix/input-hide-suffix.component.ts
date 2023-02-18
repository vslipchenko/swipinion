import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {InputComponent} from '~app/shared/components/input/input.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-input-hide-suffix',
  templateUrl: './input-hide-suffix.component.html',
  styleUrls: ['./input-hide-suffix.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIconModule],
})
export class InputHideSuffixComponent {
  @Input() public input!: InputComponent;
}
