import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
  selector: 'app-statistics-action',
  templateUrl: './statistics-action.component.html',
  styleUrls: ['./statistics-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsActionComponent implements Destroyable {
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }
}
