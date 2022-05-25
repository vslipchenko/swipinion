import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'app-opinion-snackbar',
  templateUrl: './opinion-snackbar.component.html',
  styleUrls: ['./opinion-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionSnackbarComponent {
  public constructor(
    @Inject(MAT_SNACK_BAR_DATA) public readonly data: string,
    public readonly snackbar: MatSnackBarRef<OpinionSnackbarComponent>,
  ) {}
}
