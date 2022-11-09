import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Select} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Observable} from 'rxjs';
import {ActiveConversation} from '~app/typings/user-messages/user-messages.interfaces';
import {MessagesDirective} from '~app/shared/directives/messages/messages.directive';

@Component({
  selector: 'app-user-messages-wrapper',
  templateUrl: './user-messages-wrapper.component.html',
  styleUrls: ['./user-messages-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMessagesWrapperComponent implements OnInit {
  @Select(AppSelectors.conversation) protected conversation$!: Observable<ActiveConversation>;

  public constructor(private readonly messagesDirective: MessagesDirective) {}

  ngOnInit(): void {}
}
