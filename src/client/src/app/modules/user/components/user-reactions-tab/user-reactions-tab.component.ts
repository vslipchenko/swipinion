import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngxs/store';
import {UserSelectors} from '~app/modules/user/store/user.selectors';

@Component({
  selector: 'app-user-reactions-tab',
  templateUrl: './user-reactions-tab.component.html',
  styleUrls: ['./user-reactions-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserReactionsTabComponent {
  protected readonly profile = this.store.selectSnapshot(UserSelectors.isProfilePath);

  public constructor(private readonly store: Store) {}
}
