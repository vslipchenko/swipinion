import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  FetchUserConversationPayload,
  UIUserConversationMessage,
  UnreadMessage,
} from '~app/typings/user-messages/user-messages.interfaces';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {
  FetchUserConversation,
  FetchUserSavedMessages,
  RunConversationMessageStatusCheck,
  SendUserMessage,
  SendUserSavedMessage,
} from '~app/modules/app/store/app.actions';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {BehaviorSubject, map, Observable, of, skipWhile, Subject, Subscription, takeUntil, timer} from 'rxjs';
import {getInterlocutorId} from '~app/utilities/user-messages';
import {USER_CONVERSATION_MESSAGES_FETCH_LIMIT} from '~app/constants/user-messages';
import {USER_STATUS_POLLING_INTERVAL} from '~app/constants/user-status';
import {TextareaComponent} from '~app/shared/components/textarea/textarea.component';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationComponent implements OnInit, Destroyable {
  @Select(AppSelectors.unreadMessages) public unreadMessages$!: Observable<Array<UnreadMessage>>;

  @Input() public edgeId = '';
  @Input() public username = '';
  @Input() public thumbnail = '';
  @Input() public userId1 = '';
  @Input() public userId2 = '';
  @Input() public unread = false;
  @Input() public savedMessages = false;
  @Input() public accordionExpanded!: EventEmitter<void>;
  @Input() public accordionCollapsed!: EventEmitter<void>;

  @Output() public back = new EventEmitter<void>();
  // @Output() public loadStart = new EventEmitter<void>();
  // @Output() public loadEnd = new EventEmitter<void>();
  @ViewChild('textarea') public textarea!: TextareaComponent;

  // public disableSendButton = false;
  public conversationMessages$: Observable<Array<UIUserConversationMessage>> = of([]);
  public canLoadMore$: Observable<boolean> = of(true);
  public interlocutorId = '';
  public readonly messagesFetchLimit = USER_CONVERSATION_MESSAGES_FETCH_LIMIT;
  public readonly updating$ = new BehaviorSubject(false);
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();
  protected definedUsername = '';
  protected unreadMessagesSubscription!: Subscription;
  protected messageStatusCheckSubscription!: Subscription;
  private messageStatusCheckTimestamp = 0;

  public constructor(private readonly store: Store, private readonly actions$: Actions) {
    this.actions$
      .pipe(takeUntil(this.destroy$), ofActionCompleted(FetchUserConversation, FetchUserSavedMessages))
      .subscribe(() => {
        this.loading$.next(false);
        this.updating$.next(false);
      });

    this.actions$
      .pipe(takeUntil(this.destroy$), ofActionCompleted(SendUserMessage, SendUserSavedMessage))
      .subscribe(() => {
        this.textarea.resetValue();
        this.textarea.control.enable();

        // this.disableSendButton = false;

        this.updating$.next(false);
      });
  }

  public ngOnInit(): void {
    this.definedUsername = this.username ? this.username : this.savedMessages ? 'Saved Messages' : 'Deleted Account';

    this.interlocutorId = getInterlocutorId(this.userId1, this.userId2, this.store.selectSnapshot(AppSelectors.userId));

    this.conversationMessages$ = this.store
      .select(
        this.savedMessages ? AppSelectors.savedMessages : AppSelectors.conversationMessages(this.userId1, this.userId2),
      )
      .pipe(map((value) => value || []));

    this.canLoadMore$ = this.store.select(
      this.savedMessages
        ? AppSelectors.canLoadMoreSavedMessages
        : AppSelectors.canLoadMoreConversationMessages(this.userId1, this.userId2),
    );

    this.actualizeConversationIfStale();

    if (this.savedMessages) return;

    if (this.accordionExpanded) return this.listenToAccordionStateChange();

    this.listenToUnreadMessagesChanges();

    this.runMessageStatusCheck();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.updating$.complete();
    this.loading$.complete();
  }

  public spinnerInView(inView: boolean, edgeId: string): void {
    if (!inView) return;

    this.savedMessages ? this.fetchSavedMessages(edgeId) : this.fetchUserConversation(edgeId);
  }

  public sendMessage(textarea: TextareaComponent, messages: Array<UIUserConversationMessage>): void {
    // this.disableSendButton = true;
    textarea.control.disable();

    this.updating$.next(true);

    const body = textarea.control.value;

    if (this.savedMessages) {
      this.store.dispatch(new SendUserSavedMessage(body));
      return;
    }

    const edgeId = messages[0]?.id; // Use the most recent message as the edge

    this.store.dispatch(
      new SendUserMessage({
        edgeId,
        body,
        username: this.username,
        thumbnail: this.thumbnail,
        recipientId: this.interlocutorId,
      }),
    );
  }

  private actualizeConversationIfStale(): void {
    const {relevant, hasNewMessage} = this.conversationIsRelevant;
    // Fetch only new messages
    if (hasNewMessage) return this.fetchUserConversation(this.edgeId, true, true);
    // Init conversation messages fetch;
    if (!relevant) this.savedMessages ? this.fetchSavedMessages() : this.fetchUserConversation('', this.unread);
  }

  private listenToUnreadMessagesChanges(): void {
    this.unreadMessagesSubscription = this.unreadMessages$
      .pipe(
        takeUntil(this.destroy$),
        skipWhile(() => !this.conversationInitialized || this.updating$.getValue()), // Ignore if conversation is not initializer or while messages processing is in progress;
      )
      .subscribe((messages) => {
        const unreadMessage = messages.find((message) => message.sender_id === this.interlocutorId);

        if (!unreadMessage) return;

        const recentMessageId = this.conversation[0].id;

        // Fetch new messages with id greater than of the most recent message in the conversation; immediately mark as read
        this.fetchUserConversation(recentMessageId, true, true);
      });
  }

  private runMessageStatusCheck(): void {
    this.messageStatusCheckSubscription = timer(0, USER_STATUS_POLLING_INTERVAL)
      .pipe(
        takeUntil(this.destroy$),
        skipWhile(() => {
          // Run status check only if enough time passed between current and previous check; Needed due to a possible accordion toggle api call overhead
          const time = new Date().getTime();

          if (
            this.messageStatusCheckTimestamp &&
            time - this.messageStatusCheckTimestamp < USER_STATUS_POLLING_INTERVAL
          )
            return true;

          this.messageStatusCheckTimestamp = time;

          return false;
        }),
      )
      .subscribe(() => {
        this.store.dispatch(new RunConversationMessageStatusCheck(this.interlocutorId));
      });
  }

  private fetchSavedMessages(edgeId?: string): void {
    if (!edgeId) this.loading$.next(true); // Show loading spinner only on initial loading

    this.store.dispatch(new FetchUserSavedMessages(edgeId));
  }

  private fetchUserConversation(edgeId: string, markRead = false, fetchNew = false): void {
    if (!edgeId) {
      this.loading$.next(true); // Show loading spinner only on initial loading
    } else if (fetchNew) {
      this.updating$.next(true); // Show Updating status label
    }

    const payload = {
      // Order does not matter here
      user_id_1: this.userId1,
      user_id_2: this.userId2,
      fetchNew,
      markRead,
    } as FetchUserConversationPayload;

    if (edgeId) payload.edgeId = edgeId;

    this.store.dispatch(new FetchUserConversation(payload));
  }

  private listenToAccordionStateChange(): void {
    this.accordionExpanded.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.runMessageStatusCheck();
      this.listenToUnreadMessagesChanges(); // Emits immediately on subscription;
    });

    this.accordionCollapsed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.unreadMessagesSubscription.unsubscribe();
      this.messageStatusCheckSubscription.unsubscribe();
    });
  }

  private get conversationIsRelevant(): {relevant?: boolean; hasNewMessage?: boolean} {
    if (!this.conversationInitialized) return {relevant: false}; // Conversation is not yet stored in the state: requires fetch

    const unreadMessages = this.store.selectSnapshot(AppSelectors.unreadMessages);

    if (!unreadMessages.length) return {relevant: true}; // No new messages, conversation can be renewed

    const recentMessageId = this.conversation[0].id;

    const hasNewMessage = unreadMessages.some(
      (message) => message.sender_id === this.interlocutorId && message.id > recentMessageId,
    );

    return {relevant: !hasNewMessage, hasNewMessage}; // Check if there are ny new messages sent by interlocutor
  }

  private get conversationInitialized(): boolean {
    return this.store.selectSnapshot(
      this.savedMessages
        ? AppSelectors.savedMessagesInitialized
        : AppSelectors.conversationMessagesInitialized(this.userId1, this.userId2),
    );
  }

  private get conversation(): Array<UIUserConversationMessage> {
    return this.store.selectSnapshot(
      this.savedMessages ? AppSelectors.savedMessages : AppSelectors.conversationMessages(this.userId1, this.userId2),
    );
  }
}
