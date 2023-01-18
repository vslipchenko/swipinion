import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA, MatLegacySnackBarRef as MatSnackBarRef} from '@angular/material/legacy-snack-bar';
import {Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';

@Component({
  selector: 'app-opinion-snackbar',
  templateUrl: './opinion-success-snackbar.component.html',
  styleUrls: ['./opinion-success-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionSuccessSnackbarComponent {
  public constructor(
    @Inject(MAT_SNACK_BAR_DATA) public readonly data: string,
    public readonly store: Store,
    public readonly snackbar: MatSnackBarRef<OpinionSuccessSnackbarComponent>,
  ) {}

  public get username(): string {
    return this.store.selectSnapshot(AppSelectors.userEssentials).username;
  }
}
