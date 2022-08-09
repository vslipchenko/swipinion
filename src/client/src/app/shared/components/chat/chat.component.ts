import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
  @Input() public chatInfo: {username: string; thumbnail: string; savedMessages: boolean} = {
    username: '',
    thumbnail: '',
    savedMessages: false,
  };

  @Output() public back = new EventEmitter<void>();
  @Output() public loadStart = new EventEmitter<void>();
  @Output() public loadEnd = new EventEmitter<void>();

  public username = '';

  public ngOnInit(): void {
    const {username, savedMessages} = this.chatInfo;

    this.username = username ? username : savedMessages ? 'Saved Messages' : 'Deleted Account';

    this.loadStart.next();
  }
}
