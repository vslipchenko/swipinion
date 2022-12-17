import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {LegacyProgressSpinnerMode as ProgressSpinnerMode} from '@angular/material/legacy-progress-spinner';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  @Input() public color: ThemePalette;
  @Input() public mode: ProgressSpinnerMode = 'indeterminate';
}
