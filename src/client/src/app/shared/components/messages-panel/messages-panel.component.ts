import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Select} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Observable} from 'rxjs';
import {ActiveConversation} from '~app/typings/user-messages/user-messages.interfaces';

@Component({
  selector: 'app-messages-panel',
  templateUrl: './messages-panel.component.html',
  styleUrls: ['./messages-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesPanelComponent {
  @Select(AppSelectors.conversation) protected conversation$!: Observable<ActiveConversation>;
}
