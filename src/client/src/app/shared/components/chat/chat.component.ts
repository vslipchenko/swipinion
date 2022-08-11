import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserMessage} from '~app/typings/user-messages/user-messages.interfaces';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
  @Input() public chatInfo: {message: UserMessage; savedMessages: boolean} = {
    message: {
      id: '',
      user_id_1: '',
      user_id_2: '',
      teaser: '',
      username: '',
      thumbnail: '',
      read: false,
      created_at: 0,
    },
    savedMessages: false,
  };

  @Output() public back = new EventEmitter<void>();
  @Output() public loadStart = new EventEmitter<void>();
  @Output() public loadEnd = new EventEmitter<void>();

  public username = '';

  public ngOnInit(): void {
    const {message, savedMessages} = this.chatInfo;

    this.username = message.username ? message.username : savedMessages ? 'Saved Messages' : 'Deleted Account';

    this.loadStart.next();
  }
}
