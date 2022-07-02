import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';

@Component({
  selector: 'app-opinion-snackbar',
  templateUrl: './opinion-snackbar.component.html',
  styleUrls: ['./opinion-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionSnackbarComponent {
  public constructor(
    @Inject(MAT_SNACK_BAR_DATA) public readonly data: string,
    public readonly store: Store,
    public readonly snackbar: MatSnackBarRef<OpinionSnackbarComponent>,
  ) {
  }

  public get username(): string {
    return this.store.selectSnapshot(AppSelectors.userProfile).username;
  }
}
