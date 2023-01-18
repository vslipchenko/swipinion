import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {Actions, ofActionErrored, ofActionSuccessful, Store} from '@ngxs/store';
import {UnfollowUser} from '~app/modules/user/store/user.actions';
import {ResolvedUserData} from '~app/typings/user/user.interfaces';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';

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
    @Inject(MAT_DIALOG_DATA) public readonly data: {title: string; body: string; action: string},
    private readonly store: Store,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialogRef<UnfollowUserDialogComponent>,
    private readonly actions$: Actions,
  ) {
    this.profile = this.store.selectSnapshot(UserSelectors.resolvedUserData);

    this.actions$.pipe(takeUntil(this.destroy$), ofActionSuccessful(UnfollowUser)).subscribe(() => {
      this.dialog.close();
    });

    this.actions$.pipe(takeUntil(this.destroy$), ofActionErrored(UnfollowUser)).subscribe(() => {
      this.loading$.next(false);
      this.snackbar.open('Something went wrong. Please try again later', 'OK');
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public unfollow(): void {
    this.loading$.next(true);

    this.store.dispatch(new UnfollowUser(this.profile.id));
  }
}
