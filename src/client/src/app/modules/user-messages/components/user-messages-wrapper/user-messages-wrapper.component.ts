import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Observable} from 'rxjs';
import {ActiveConversation} from '~app/typings/user-messages/user-messages.interfaces';
import {MessagesDirective} from '~app/shared/directives/messages/messages.directive';
import {SetActiveConversation} from '~app/modules/app/store/app.actions';

@Component({
  selector: 'app-user-messages-wrapper',
  templateUrl: './user-messages-wrapper.component.html',
  styleUrls: ['./user-messages-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMessagesWrapperComponent implements OnInit {
  @Select(AppSelectors.conversation) protected conversation$!: Observable<ActiveConversation>;

  public showAccordion = false;

  public constructor(protected readonly messagesDirective: MessagesDirective, private readonly store: Store) {}

  public ngOnInit(): void {
    this.messagesDirective.initializeMessages();
  }

  public closeConversation(): void {
    this.showAccordion = false;

    this.store.dispatch(new SetActiveConversation(null)); // Reset active conversation
  }
}
