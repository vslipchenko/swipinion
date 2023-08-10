import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {
  MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
  MatLegacySnackBarRef as MatSnackBarRef,
} from '@angular/material/legacy-snack-bar';
import {Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-opinion-snackbar',
  templateUrl: './opinion-added-snackbar.component.html',
  styleUrls: ['./opinion-added-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ButtonComponent, RouterLink],
})
export class OpinionAddedSnackbarComponent {
  public constructor(
    @Inject(MAT_SNACK_BAR_DATA) protected readonly data: string,
    private readonly store: Store,
    protected readonly snackbar: MatSnackBarRef<OpinionAddedSnackbarComponent>,
  ) {}

  protected get username(): string {
    return this.store.selectSnapshot(AppSelectors.userEssentials).username;
  }
}
