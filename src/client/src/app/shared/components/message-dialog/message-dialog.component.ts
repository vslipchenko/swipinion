import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {MessageDialogData} from '~app/typings/user-messages/user-messages.interfaces';
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Store} from '@ngxs/store';
import {SendUserMessage, SendUserSavedMessage} from '~app/modules/app/store/app.actions';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppSelectors} from '~app/modules/app/store/app.selectors';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageDialogComponent implements Destroyable, OnInit {
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();
  public title = 'Send message';
  public actionText = 'Send';

  public constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: MessageDialogData,
    private readonly dialog: MatDialogRef<MessageDialogComponent>,
    private readonly actions$: Actions,
    private readonly snackbar: MatSnackBar,
    private readonly store: Store,
  ) {
    this.actions$
      .pipe(takeUntil(this.destroy$), ofActionSuccessful(SendUserMessage, SendUserSavedMessage))
      .subscribe(() => {
        this.dialog.close();
      });

    this.actions$
      .pipe(takeUntil(this.destroy$), ofActionCompleted(SendUserMessage, SendUserSavedMessage))
      .subscribe(() => {
        this.loading$.next(false);
      });

    this.actions$
      .pipe(takeUntil(this.destroy$), ofActionErrored(SendUserMessage, SendUserSavedMessage))
      .subscribe(() => {
        this.snackbar.open('Something went wrong. Please try again later', 'OK', {
          panelClass: 'snackbar-error',
        });
      });
  }

  public ngOnInit(): void {
    if (this.data.saveMessage) {
      this.title = 'Save message';
      this.actionText = 'Save';
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public message(body: string): void {
    this.loading$.next(true);

    this.store.dispatch(
      this.data.saveMessage
        ? new SendUserSavedMessage(body)
        : new SendUserMessage({
            body,
            username: this.data.username,
            thumbnail: this.data.thumbnail,
            recipientId: this.data.recipientId,
            edgeId: this.interlocutorMessageEdgeId,
          }),
    );
  }

  private get interlocutorMessageEdgeId(): string | undefined {
    const conversation = this.store.selectSnapshot(
      AppSelectors.conversationMessages(this.store.selectSnapshot(AppSelectors.userId), this.data.recipientId),
    );

    if (!conversation) return undefined; // Do not include this field in a payload

    return conversation[0].id;
  }
}
