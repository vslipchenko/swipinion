import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-opinion-placeholder',
  templateUrl: './opinion-placeholder.component.html',
  styleUrls: ['./opinion-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OpinionPlaceholderComponent {}
