import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, finalize, Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {UnfollowUser} from '~app/modules/user/store/user.actions';
import {ResolvedUserData} from '~app/typings/user/user.interfaces';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-unfollow-user-dialog',
  templateUrl: './unfollow-user-dialog.component.html',
  styleUrls: ['./unfollow-user-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnfollowUserDialogComponent implements Destroyable {
  public readonly destroy$ = new Subject<void>();
  public readonly loading$ = new BehaviorSubject(false);
  public readonly profile: ResolvedUserData;

  public constructor(
    private readonly store: Store,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialogRef<UnfollowUserDialogComponent>,
  ) {
    this.profile = this.store.selectSnapshot(UserSelectors.resolvedUserData);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public unfollow(): void {
    this.loading$.next(true);

    this.store
      .dispatch(new UnfollowUser(this.profile.id))
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading$.next(false)),
      )
      .subscribe(
        () => this.dialog.close(),
        () => this.snackbar.open('Something went wrong. Please try again later', 'OK'),
      );
  }
}
