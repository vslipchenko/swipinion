import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject, debounceTime, filter, finalize, Subscription, switchMap, tap} from 'rxjs';
import {UserSearchService} from '~app/services/user-search/user-search.service';
import {untilDestroyed} from '~app/utilities/operator';
import {UserEssentials} from '~app/typings/user-search/user-search.interfaces';
import {Store} from '@ngxs/store';
import {SetActiveConversation} from '~app/modules/app/store/app.actions';
import {ActiveConversationType} from '~app/typings/user-conversations/user-conversations.enums';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {InputComponent} from '~app/shared/components/input/input.component';
import {InputResetSuffixComponent} from '~app/shared/components/input-reset-suffix/input-reset-suffix.component';
import {ProgressSpinnerComponent} from '~app/shared/components/progress-spinner/progress-spinner.component';
import {ThumbnailComponent} from '~app/shared/components/thumbnail/thumbnail.component';
import {USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH} from '~app/constants/validation';

@Component({
  selector: 'app-conversation-user-search',
  templateUrl: './conversation-user-search.component.html',
  styleUrls: ['./conversation-user-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    InputComponent,
    InputResetSuffixComponent,
    ProgressSpinnerComponent,
    ThumbnailComponent,
  ],
})
export class ConversationUserSearchComponent implements OnDestroy {
  protected readonly searchControl = new FormControl();
  protected readonly loading$ = new BehaviorSubject(false);

  protected userEssentials: Array<UserEssentials> = [];

  private userSearchSubscription!: Subscription;
  private readonly untilDestroyed = untilDestroyed();

  public constructor(private readonly store: Store, private readonly userSearchService: UserSearchService) {
    this.listenToControlValueChanges();
  }

  public ngOnDestroy(): void {
    this.loading$.complete();
  }

  protected resetSearch(): void {
    this.userSearchSubscription.unsubscribe();
    this.searchControl.setValue('', {emitEvent: false});
    this.userEssentials = [];
    this.listenToControlValueChanges();
  }

  protected startConversation(user: UserEssentials): void {
    const userId = this.store.selectSnapshot(AppSelectors.userId);
    const conversationPreviewMessagePresent = this.store
      .selectSnapshot(AppSelectors.messages)
      .some((message) => message.sender_id === user.id || message.recipient_id === user.id);

    this.store.dispatch(
      new SetActiveConversation({
        edgeId: this.store.selectSnapshot(AppSelectors.conversationMessages(userId, user.id))?.[0]?.id,
        userId1: userId, // Authed user id
        userId2: user.id, // Resolved user id / Interlocutor id
        username: user.username,
        thumbnail: user.thumbnail,
        unread: conversationPreviewMessagePresent
          ? this.store.selectSnapshot(AppSelectors.unreadMessages).some((message) => message.sender_id === user.id)
          : true, // Force true in order to mark messages as unread in advance in order to prevent unread messages desync
        type: ActiveConversationType.UserConversation,
      }),
    );
  }

  private listenToControlValueChanges(): void {
    this.userSearchSubscription = this.searchControl.valueChanges
      .pipe(
        this.untilDestroyed(),
        filter((value) => value.length >= USERNAME_MIN_LENGTH && value.length <= USERNAME_MAX_LENGTH), // Start search only if username length is valid
        tap(() => {
          this.loading$.next(true);
        }),
        finalize(() => this.loading$.next(false)),
        debounceTime(1000),
        switchMap((value) => this.userSearchService.searchUser(value as string)),
      )
      .subscribe(({data}) => {
        this.loading$.next(false);

        if (!data.userSearch) return;

        this.userEssentials = data.userSearch;
      });
  }
}
