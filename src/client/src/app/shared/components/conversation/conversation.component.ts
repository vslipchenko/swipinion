import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  FetchUserConversationPayload,
  UIUserConversationMessage,
  UIUserMessage,
} from '~app/typings/user-messages/user-messages.interfaces';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {
  FetchUserConversation,
  RunConversationMessageStatusCheck,
  SendUserMessage,
} from '~app/modules/app/store/app.actions';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {BehaviorSubject, Observable, of, skipWhile, Subject, take, takeUntil, timer} from 'rxjs';
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
  @Select(AppSelectors.unreadMessages) public unreadMessages$!: Observable<Array<UIUserMessage>>;

  @Input() public conversationInfo: {message: UIUserMessage; savedMessages: boolean} = {
    message: {
      id: '',
      sender_id: '',
      recipient_id: '',
      teaser: '',
      username: '',
      thumbnail: '',
      date: '',
      unread: false,
      read: false,
      created_at: 0,
    },
    savedMessages: false,
  };

  @Output() public back = new EventEmitter<void>();
  // @Output() public loadStart = new EventEmitter<void>();
  // @Output() public loadEnd = new EventEmitter<void>();

  public username = '';
  public conversationMessages$: Observable<Array<UIUserConversationMessage>> = of([]);
  public conversationUnprocessedMessages$: Observable<Array<UIUserConversationMessage>> = of([]);
  public canLoadMore$: Observable<boolean> = of(true);
  public interlocutorId = '';
  public readonly messagesFetchLimit = USER_CONVERSATION_MESSAGES_FETCH_LIMIT;
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();

  public constructor(private readonly store: Store, private readonly actions$: Actions) {
    this.actions$.pipe(takeUntil(this.destroy$), ofActionCompleted(FetchUserConversation), take(1)).subscribe(() => {
      this.loading$.next(false);
    });
  }

  public ngOnInit(): void {
    const {message, savedMessages} = this.conversationInfo;

    this.username = message.username ? message.username : savedMessages ? 'Saved Messages' : 'Deleted Account';

    this.interlocutorId = getInterlocutorId(
      message.sender_id,
      message.recipient_id,
      this.store.selectSnapshot(AppSelectors.userId),
    );

    this.conversationMessages$ = this.store.select(
      AppSelectors.conversationMessages(message.sender_id, message.recipient_id),
    );

    this.conversationUnprocessedMessages$ = this.store.select(
      AppSelectors.conversationUnprocessedMessages(message.sender_id, message.recipient_id),
    );

    this.canLoadMore$ = this.store.select(
      AppSelectors.canLoadMoreConversationMessages(message.sender_id, message.recipient_id),
    );

    this.runMessageStatusCheck();

    this.listenToUnreadMessagesChanges();

    this.actualizeConversationIfStale();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public spinnerInView(inView: boolean, edgeMessageId: string): void {
    if (!inView) return;

    this.fetchUserConversation(edgeMessageId);
  }

  public sendMessage(textarea: TextareaComponent, messages: Array<UIUserConversationMessage>): void {
    const body = textarea.control.value;
    const edgeId = messages.find((message) => message.sender_id === this.interlocutorId)?.id;

    this.store.dispatch(
      new SendUserMessage({
        edgeId,
        body,
        username: this.conversationInfo.message.username,
        thumbnail: this.conversationInfo.message.thumbnail,
        recipientId: this.interlocutorId,
      }),
    );
    textarea.resetValue();
  }

  private actualizeConversationIfStale(): void {
    const {relevant, hasNewMessage} = this.conversationIsRelevant;
    // Fetch only new messages
    if (hasNewMessage) return this.fetchUserConversation(this.conversationInfo.message.id, true, true);
    // Init conversation messages fetch;
    if (!relevant) this.fetchUserConversation('', this.conversationInfo.message.unread);
  }

  private listenToUnreadMessagesChanges(): void {
    this.unreadMessages$
      .pipe(
        takeUntil(this.destroy$),
        skipWhile(() => !this.conversationInitialized),
      )
      .subscribe((messages) => {
        const unreadMessage = messages.find((message) => message.sender_id === this.interlocutorId);

        if (!unreadMessage) return;

        const unprocessedMessages = this.store.selectSnapshot(
          AppSelectors.conversationUnprocessedMessages(
            this.conversationInfo.message.sender_id,
            this.conversationInfo.message.recipient_id,
          ),
        );

        if (unprocessedMessages.length) return; // Ignore while messages processing is in progress

        const recentMessageId = this.conversation[0].id;

        // Fetch new messages with id greater than of the most recent message in the conversation; immediately mark as read
        this.fetchUserConversation(recentMessageId, true, true);
      });
  }

  private runMessageStatusCheck(): void {
    timer(0, USER_STATUS_POLLING_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(new RunConversationMessageStatusCheck(this.interlocutorId));
      });
  }

  private fetchUserConversation(edgeId: string, markRead = false, fetchNew = false): void {
    if (!edgeId) this.loading$.next(true); // Show loading spinner only on initial loading

    const payload = {
      // Order does not matter here
      user_id_1: this.conversationInfo.message.sender_id,
      user_id_2: this.conversationInfo.message.recipient_id,
      fetchNew,
      markRead,
    } as FetchUserConversationPayload;

    if (edgeId) payload.edgeId = edgeId;

    this.store.dispatch(new FetchUserConversation(payload));
  }

  private get conversationIsRelevant(): {relevant?: boolean; hasNewMessage?: boolean} {
    const conversation = this.conversation;

    if (!conversation) return {relevant: false}; // Conversation is not yet stored in the state: requires fetch

    const unreadMessages = this.store.selectSnapshot(AppSelectors.unreadMessages);

    if (!unreadMessages.length) return {relevant: true}; // No new messages, conversation can be renewed

    // const recentMessageId = conversation.find((message) => message.sender_id === interlocutorId).id;
    const recentMessageId = conversation[0].id;

    const hasNewMessage = unreadMessages.some(
      (message) => message.sender_id === this.interlocutorId && message.id > recentMessageId,
    );

    return {relevant: !hasNewMessage, hasNewMessage}; // Check if there are ny new messages sent by interlocutor
  }

  private get conversationInitialized(): boolean {
    return Boolean(this.conversation?.length);
  }

  private get conversation(): Array<UIUserConversationMessage> {
    return this.store.selectSnapshot(
      AppSelectors.conversationMessages(
        this.conversationInfo.message.sender_id,
        this.conversationInfo.message.recipient_id,
      ),
    );
  }
}
