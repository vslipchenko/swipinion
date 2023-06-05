import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {
  MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
  MatLegacySnackBarRef as MatSnackBarRef,
} from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'app-opinion-fail-snackbar',
  templateUrl: './opinion-fail-snackbar.component.html',
  styleUrls: ['./opinion-fail-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionFailSnackbarComponent {
  public constructor(
    @Inject(MAT_SNACK_BAR_DATA) public readonly data: string, // html string
    protected readonly snackbar: MatSnackBarRef<OpinionFailSnackbarComponent>,
  ) {}
}
