import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FetchUserConversationPayload, UIUserMessage} from '~app/typings/user-messages/user-messages.interfaces';
import {Store} from '@ngxs/store';
import {FetchUserConversation} from '~app/modules/app/store/app.actions';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationComponent implements OnInit {
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

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    const {message, savedMessages} = this.conversationInfo;

    this.username = message.username ? message.username : savedMessages ? 'Saved Messages' : 'Deleted Account';

    this.loadStart.next();

    this.fetchUserConversation('', message.unread);
  }

  private fetchUserConversation(edgeId: string, markRead = false): void {
    const payload = {
      // Order does not matter here
      user_id_1: this.conversationInfo.message.sender_id,
      user_id_2: this.conversationInfo.message.recipient_id,
      markRead,
    } as FetchUserConversationPayload;

    if (edgeId) payload.edgeId = edgeId;

    this.store.dispatch(new FetchUserConversation(payload));
  }
}
