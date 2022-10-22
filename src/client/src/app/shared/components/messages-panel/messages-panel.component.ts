import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Select} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-messages-panel',
  templateUrl: './messages-panel.component.html',
  styleUrls: ['./messages-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesPanelComponent {
  @Select(AppSelectors.activeConversation) protected activeConversation$!: Observable<string>;
}
