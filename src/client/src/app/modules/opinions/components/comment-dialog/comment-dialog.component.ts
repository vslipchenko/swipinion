import {ChangeDetectionStrategy, Component, EventEmitter, Inject, Output} from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import {Subject} from 'rxjs';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {FormControl, ValidationErrors, Validators} from '@angular/forms';
import {OPINION_COMMENT_MAX_LENGTH} from '~app/constants/validation';
import {OpinionReaction} from '~app/typings/opinion/opinion.enums';
import {ThemePalette} from '@angular/material/core';
import {Store} from '@ngxs/store';
import {OpinionsSelectors} from '~app/modules/opinions/store/opinions.selectors';
import {ReactToUserOpinion} from '~app/modules/opinions/store/opinions.actions';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentDialogComponent implements Destroyable {
  @Output() public readonly reacted = new EventEmitter();

  public readonly destroy$ = new Subject<void>();

  protected readonly reaction: 'Agree' | 'Disagree' = 'Agree';
  protected readonly commentButtonColor: ThemePalette;
  protected readonly commentControl = new FormControl('', Validators.maxLength(OPINION_COMMENT_MAX_LENGTH));

  public constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: {reaction: OpinionReaction},
    private readonly dialog: MatDialogRef<CommentDialogComponent>,
    private readonly store: Store,
  ) {
    if (data.reaction === OpinionReaction.Agree) {
      this.reaction = 'Agree';
      this.commentButtonColor = 'primary';
    } else {
      this.reaction = 'Disagree';
      this.commentButtonColor = 'accent';
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected commentErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return `${OPINION_COMMENT_MAX_LENGTH} characters at max`;
  }

  protected reactWithComment(): void {
    if (!this.commentControl.valid) return;

    const {id, username} = this.store.selectSnapshot(OpinionsSelectors.activeOpinion);

    this.store.dispatch(
      new ReactToUserOpinion({
        opinionId: id,
        username,
        reaction: this.data.reaction,
        comment: this.commentControl.value || null,
        optimisticStatisticUpdate: false,
      }),
    );
    // Trigger optimistic reaction processing
    this.reacted.emit();
  }
}
