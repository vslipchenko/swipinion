import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Observable} from 'rxjs';
import {UIUserMessage} from '~app/typings/user-messages/user-messages.interfaces';
import {FetchUserMessages, SetActiveConversation} from '~app/modules/app/store/app.actions';
import {ActiveConversationType} from '~app/typings/user-conversations/user-conversations.enums';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageListComponent {
  @Select(AppSelectors.savedMessage) public savedMessage$!: Observable<UIUserMessage>;
  @Select(AppSelectors.messages) public messages$!: Observable<Array<UIUserMessage>>;
  @Select(AppSelectors.canLoadMoreMessages) public canLoadMore$!: Observable<boolean>;

  @Input() public messageClass = '';
  @Input() public gradientPlaceholder = false;

  protected userId = '';

  public constructor(private readonly store: Store) {
    this.userId = this.store.selectSnapshot(AppSelectors.userId);
  }

  protected spinnerInView(inView: boolean, edgeMessageId: string): void {
    if (!inView) return;

    this.store.dispatch(new FetchUserMessages(edgeMessageId));
  }

  protected openConversation(savedMessages: boolean, message?: UIUserMessage): void {
    this.store.dispatch(
      new SetActiveConversation(
        message
          ? {
              edgeId: message.id,
              userId1: message.sender_id,
              userId2: message.recipient_id,
              username: message.username,
              thumbnail: message.thumbnail,
              unread: message.unread,
              type: ActiveConversationType.UserConversation,
            }
          : {
              edgeId: '',
              userId1: '',
              userId2: '',
              username: '',
              thumbnail: '',
              unread: false,
              type: ActiveConversationType.SavedMessages,
            },
      ),
    );
  }

  protected messageTrackBy(_: number, message: UIUserMessage): string {
    return message.id;
  }
}
