import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Observable} from 'rxjs';
import {ActiveConversation} from '~app/typings/user-messages/user-messages.interfaces';
import {MessagesDirective} from '~app/shared/directives/messages/messages.directive';
import {SetActiveConversation} from '~app/modules/app/store/app.actions';
import {ActiveConversationType} from '~app/typings/user-conversations/user-conversations.enums';

@Component({
  selector: 'app-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [MessagesDirective],
})
export class UserMessagesComponent implements OnInit {
  @Select(AppSelectors.conversation) protected readonly conversation$!: Observable<ActiveConversation>;

  public showAccordion = false;

  public constructor(protected readonly messagesDirective: MessagesDirective, private readonly store: Store) {}

  public ngOnInit(): void {
    this.messagesDirective.initializeMessages();
  }

  public closeConversation(): void {
    this.showAccordion = false;

    this.store.dispatch(new SetActiveConversation(null)); // Reset active conversation
  }

  protected newConversation(): void {
    this.store.dispatch(
      new SetActiveConversation({
        edgeId: '',
        userId1: '',
        userId2: '',
        username: '',
        thumbnail: '',
        unread: false,
        type: ActiveConversationType.NewConversation,
      }),
    );
  }
}
