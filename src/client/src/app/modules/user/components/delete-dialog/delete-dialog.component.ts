import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {BehaviorSubject, takeUntil} from 'rxjs';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {DeleteUserOpinion} from '~app/modules/user/store/user.actions';
import {Actions, ofActionCompleted, Store} from '@ngxs/store';
import {UserContentTab} from '~app/typings/user/user.enums';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDialogComponent {
  protected readonly subject: 'opinion' | 'reaction' | 'favorite opinion';
  protected readonly loading$ = new BehaviorSubject(false);

  public constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly data: {
      id: string;
      tab: UserContentTab;
    },
    private readonly dialog: MatDialogRef<DeleteDialogComponent>,
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly snackbar: MatSnackBar,
  ) {
    switch (this.data.tab) {
      case UserContentTab.Opinions:
        this.subject = 'opinion';
        break;
      case UserContentTab.Reactions:
        this.subject = 'reaction';
        break;
      case UserContentTab.Favorites:
        this.subject = 'favorite opinion';
        break;
    }

    this.actions$
      .pipe(takeUntil(this.dialog.afterClosed()), ofActionCompleted(DeleteUserOpinion))
      .subscribe((completion) => {
        if (!completion.result.error) return this.dialog.close(); // Assume success; We don't need to set loading to false as dialog will be closed anyway

        this.loading$.next(false);
        this.showErrorSnackbar();
      });
  }

  protected delete(): void {
    this.loading$.next(true);

    switch (this.data.tab) {
      case UserContentTab.Opinions:
        this.store.dispatch(new DeleteUserOpinion(this.data.id));
        break;
      case UserContentTab.Reactions:
        break;
      case UserContentTab.Favorites:
        break;
    }
  }

  private showErrorSnackbar(): void {
    this.snackbar.open('Something went wrong. Please try again later', 'OK', {
      panelClass: 'snackbar-error',
    });
  }
}
