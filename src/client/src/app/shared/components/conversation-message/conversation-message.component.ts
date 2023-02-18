import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {UIUserConversationMessage} from '~app/typings/user-messages/user-messages.interfaces';
import {NgClass, NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-conversation-message',
  templateUrl: './conversation-message.component.html',
  styleUrls: ['./conversation-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgClass, MatIconModule],
})
export class ConversationMessageComponent {
  @Input() public first = false;
  @Input() public interlocutorId = '';
  @Input() public message!: UIUserConversationMessage;
}
