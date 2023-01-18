import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {LegacyProgressSpinnerMode as ProgressSpinnerMode} from '@angular/material/legacy-progress-spinner';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSpinnerComponent {
  @Input() public color: ThemePalette;
  @Input() public mode: ProgressSpinnerMode = 'indeterminate';
  @Input() public strokeWidth = 4;
}
