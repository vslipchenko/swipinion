import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UIUserMessage} from '~app/typings/user-messages/user-messages.interfaces';
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

    this.store.dispatch(
      new FetchUserChat({
        user_id_1: message.user_id_1,
        user_id_2: message.user_id_2,
        edgeId: '0',
        markRead: true,
      }),
    );
  }
}
