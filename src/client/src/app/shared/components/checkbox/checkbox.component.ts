import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatLegacyCheckboxModule} from '@angular/material/legacy-checkbox';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatLegacyCheckboxModule, ReactiveFormsModule],
})
export class CheckboxComponent {
  @Input() public color: ThemePalette;
  @Input() public control = new FormControl();
  @Input() public label = '';
}
