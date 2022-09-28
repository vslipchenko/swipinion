import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {UIUserConversationMessage} from '~app/typings/user-messages/user-messages.interfaces';

@Component({
  selector: 'app-conversation-message',
  templateUrl: './conversation-message.component.html',
  styleUrls: ['./conversation-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationMessageComponent {
  @Input() public first = false;
  @Input() public interlocutorId = '';
  @Input() public message!: UIUserConversationMessage;
}
