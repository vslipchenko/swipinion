import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
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
export class UserMessagesWrapperComponent implements OnInit, OnDestroy {
  @Select(AppSelectors.conversation) protected conversation$!: Observable<ActiveConversation>;

  public constructor(protected readonly messagesDirective: MessagesDirective, private readonly store: Store) {
    this.resetActiveConversation();
  }

  public ngOnInit(): void {
    this.messagesDirective.initializeMessages();
  }

  public ngOnDestroy(): void {
    this.resetActiveConversation();
  }

  private resetActiveConversation(): void {
    // Fixes issue when messages accordion impacts accordion on the user messages page  as it's being expanded automatically and vice versa due to the state.conversation value
    this.store.dispatch(new SetActiveConversation(null));
  }
}
