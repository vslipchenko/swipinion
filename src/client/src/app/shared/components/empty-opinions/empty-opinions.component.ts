import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-empty-opinions',
  templateUrl: './empty-opinions.component.html',
  styleUrls: ['./empty-opinions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyOpinionsComponent {}
