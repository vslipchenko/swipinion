import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FetchUserChatPayload, UIUserMessage} from '~app/typings/user-messages/user-messages.interfaces';
import {Store} from '@ngxs/store';
import {FetchUserChat} from '~app/modules/app/store/app.actions';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
  @Input() public chatInfo: {message: UIUserMessage; savedMessages: boolean} = {
    message: {
      id: '',
      user_id_1: '',
      user_id_2: '',
      sender_id: '',
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
    const {message, savedMessages} = this.chatInfo;

    this.username = message.username ? message.username : savedMessages ? 'Saved Messages' : 'Deleted Account';

    this.loadStart.next();

    this.fetchUserChat('', message.unread);
  }

  private fetchUserChat(edgeId: string, markRead = false): void {
    const payload = {
      user_id_1: this.chatInfo.message.user_id_1,
      user_id_2: this.chatInfo.message.user_id_2,
      markRead,
    } as FetchUserChatPayload;

    if (edgeId) payload.edgeId = edgeId;

    this.store.dispatch(new FetchUserChat(payload));
  }
}
