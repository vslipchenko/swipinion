import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
  selector: 'app-user-settings-component',
  templateUrl: './user-settings-dialog.component.html',
  styleUrls: ['./user-settings-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsDialogComponent implements OnInit, Destroyable {
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();

  public constructor() {}

  public ngOnInit(): void {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public save(): void {}
}
