import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-statistics-action',
  templateUrl: './statistics-action.component.html',
  styleUrls: ['./statistics-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsActionComponent {
  public readonly loading$ = new BehaviorSubject(false);

  public ngOnDestroy(): void {
    this.loading$.complete();
  }
}
