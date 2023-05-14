import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import {BehaviorSubject, Subject} from 'rxjs';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {FormControl, ValidationErrors} from '@angular/forms';
import {OPINION_COMMENT_MAX_LENGTH} from '~app/constants/validation';
import {OpinionReaction} from '~app/typings/opinion/opinion.enums';
import {ThemePalette} from '@angular/material/core';
import {Store} from '@ngxs/store';
import {OpinionsSelectors} from '~app/modules/opinions/store/opinions.selectors';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentDialogComponent implements Destroyable {
  public readonly destroy$ = new Subject<void>();
  protected readonly loading$ = new BehaviorSubject(false);

  protected readonly title: 'Agree' | 'Disagree' = 'Agree';
  protected readonly commentButtonColor: ThemePalette;
  protected readonly commentControl = new FormControl('');

  public constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: {reaction: OpinionReaction},
    private readonly store: Store,
  ) {
    if (data.reaction === OpinionReaction.Agree) {
      this.title = 'Agree';
      this.commentButtonColor = 'primary';
    } else {
      this.title = 'Disagree';
      this.commentButtonColor = 'accent';
    }
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
    const opinionId = this.store.selectSnapshot(OpinionsSelectors.activeOpinion).id;
  }
}
