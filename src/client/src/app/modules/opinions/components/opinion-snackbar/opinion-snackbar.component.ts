import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {
  MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
  MatLegacySnackBarRef as MatSnackBarRef,
} from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'app-opinion-snackbar',
  templateUrl: './opinion-snackbar.component.html',
  styleUrls: ['./opinion-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionSnackbarComponent {
  public constructor(
    @Inject(MAT_SNACK_BAR_DATA) protected readonly data: string, // html string
    protected readonly snackbar: MatSnackBarRef<OpinionSnackbarComponent>,
  ) {}
}
