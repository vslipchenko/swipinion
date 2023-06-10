import {ChangeDetectionStrategy, Component, EventEmitter, Inject, Output} from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {FormControl, ValidationErrors, Validators} from '@angular/forms';
import {OPINION_COMMENT_MAX_LENGTH} from '~app/constants/validation';
import {OpinionReaction} from '~app/typings/opinion/opinion.enums';
import {ThemePalette} from '@angular/material/core';
import {Actions, ofActionErrored, ofActionSuccessful, Store} from '@ngxs/store';
import {OpinionsSelectors} from '~app/modules/opinions/store/opinions.selectors';
import {ReactToUserOpinion} from '~app/modules/opinions/store/opinions.actions';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentDialogComponent implements Destroyable {
  @Output() public readonly reacted = new EventEmitter();

  public readonly destroy$ = new Subject<void>();
  protected readonly loading$ = new BehaviorSubject(false);

  protected readonly reaction: 'agree' | 'disagree' = 'agree';
  protected readonly commentButtonColor: ThemePalette;
  protected readonly commentControl = new FormControl('', Validators.maxLength(OPINION_COMMENT_MAX_LENGTH));

  public constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: {reaction: OpinionReaction},
    private readonly dialog: MatDialogRef<CommentDialogComponent>,
    private readonly snackbar: MatSnackBar,
    private readonly store: Store,
    private readonly actions$: Actions,
  ) {
    if (data.reaction === OpinionReaction.Agree) {
      this.reaction = 'agree';
      this.commentButtonColor = 'primary';
    } else {
      this.reaction = 'disagree';
      this.commentButtonColor = 'accent';
    }

    this.actions$.pipe(takeUntil(this.destroy$), ofActionSuccessful(ReactToUserOpinion)).subscribe(() => {
      this.loading$.next(false);
      this.reacted.emit();
    });

    this.actions$.pipe(takeUntil(this.destroy$), ofActionErrored(ReactToUserOpinion)).subscribe(() => {
      this.loading$.next(false);
      this.snackbar.open('Something went wrong. Please try again later', 'OK');
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  protected commentErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return `${OPINION_COMMENT_MAX_LENGTH} characters at max`;
  }

  protected comment(): void {
    if (!this.commentControl.valid) return;

    this.loading$.next(true);

    const opinionId = this.store.selectSnapshot(OpinionsSelectors.activeOpinion).id;

    this.store.dispatch(
      new ReactToUserOpinion({
        opinionId,
        reaction: this.data.reaction,
        comment: this.commentControl.value || null,
        optimisticStatisticUpdate: false,
      }),
    );
  }
}
