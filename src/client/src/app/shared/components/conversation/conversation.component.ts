import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  FetchUserConversationPayload,
  UIUserMessage,
  UserConversation,
} from '~app/typings/user-messages/user-messages.interfaces';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {FetchUserConversation} from '~app/modules/app/store/app.actions';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {Observable, skipWhile, Subject, takeUntil} from 'rxjs';

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
  @Output() public loadStart = new EventEmitter<void>();
  @Output() public loadEnd = new EventEmitter<void>();

  public username = '';
  public readonly destroy$ = new Subject<void>();
  private interlocutorId = '';

  public constructor(private readonly store: Store, private readonly actions$: Actions) {
    this.actions$.pipe(takeUntil(this.destroy$), ofActionCompleted(FetchUserConversation)).subscribe(() => {
      this.loadEnd.next();
    });
  }

  public ngOnInit(): void {
    const {message, savedMessages} = this.conversationInfo;

    this.username = message.username ? message.username : savedMessages ? 'Saved Messages' : 'Deleted Account';

    this.interlocutorId =
      message.sender_id === this.store.selectSnapshot(AppSelectors.userId) ? message.recipient_id : message.sender_id;

    this.unreadMessages$
      .pipe(
        takeUntil(this.destroy$),
        skipWhile(() => !this.conversationInitialized), // Skip until conversation is initialized
      )
      .subscribe((messages) => {
        // TODO double-check that unreadMessages contain only relevant info and can be assumed as a source of truth
        const unreadMessage = messages.find((message) => message.sender_id === this.interlocutorId);

        if (!unreadMessage) return;

        const conversation = this.conversation;

        const recentMessageId = conversation[conversation.length - 1].id;

        // Fetch new messages with id greater than of the most recent message in the conversation; immediately mark as read
        this.fetchUserConversation(recentMessageId, true, true);
      });

    // Init conversation messages fetch; TODO add possibility to init and fetch new messages only if initialized already and new messages exist
    if (!this.relevantConversationIsPresent) this.fetchUserConversation('', message.unread);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchUserConversation(edgeId: string, markRead = false, fetchNew = false): void {
    this.loadStart.next();

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

  private get relevantConversationIsPresent(): boolean {
    const conversation = this.conversation;

    if (!conversation) return false; // Conversation is not yet stored in the state: requires fetch

    const unreadMessages = this.store.selectSnapshot(AppSelectors.unreadMessages);

    if (!unreadMessages.length) return true; // No new messages, conversation can be renewed

    // const recentMessageId = conversation.find((message) => message.sender_id === interlocutorId).id;
    const recentMessageId = conversation[conversation.length - 1].id;

    const hasNewMessage = unreadMessages.some(
      (message) => message.sender_id === this.interlocutorId && message.id > recentMessageId,
    );

    return !hasNewMessage; // Check if there are ny new messages sent by interlocutor
  }

  private get conversationInitialized(): boolean {
    return Boolean(this.conversation?.length);
  }

  private get conversation(): Array<UserConversation> {
    return this.store.selectSnapshot(
      AppSelectors.conversationMessages(
        this.conversationInfo.message.sender_id,
        this.conversationInfo.message.recipient_id,
      ),
    );
  }
}
