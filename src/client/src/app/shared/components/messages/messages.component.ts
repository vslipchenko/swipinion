import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {SetActiveConversation} from '~app/modules/app/store/app.actions';
import {Observable} from 'rxjs';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UnreadMessage} from '~app/typings/user-messages/user-messages.interfaces';
import {USER_MESSAGES_FETCH_LIMIT} from '~app/constants/user-messages';
import {ActiveConversationType} from '~app/typings/user-conversations/user-conversations.enums';
import {AccordionComponent} from '~app/shared/components/accordion/accordion.component';
import {MessagesDirective} from '~app/shared/directives/messages/messages.directive';
import {AsyncPipe, NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';
import {ProgressSpinnerComponent} from '~app/shared/components/progress-spinner/progress-spinner.component';
import {MessageListComponent} from '~app/shared/components/message-list/message-list.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    AccordionComponent,
    MatIconModule,
    IconButtonComponent,
    ProgressSpinnerComponent,
    MessageListComponent,
  ],
  // TODO Angular v15 make messages directive a part of hostDirectives
})
export class MessagesComponent {
  @Select(AppSelectors.unreadMessages) public unreadMessages$!: Observable<Array<UnreadMessage>>;

  @ViewChild(AccordionComponent, {static: true}) public accordion!: AccordionComponent;

  public showConversation = false;

  public readonly messagesFetchLimit = USER_MESSAGES_FETCH_LIMIT;

  public constructor(protected readonly messagesDirective: MessagesDirective, private readonly store: Store) {}

  protected newMessage(event: MouseEvent): void {
    event.stopPropagation(); // Prevent accordion collapse

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
