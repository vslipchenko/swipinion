import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-user-reactions-tab',
  templateUrl: './user-reactions-tab.component.html',
  styleUrls: ['./user-reactions-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserReactionsTabComponent {
  @Select(UserSelectors.canLoadMoreReactions) protected readonly canLoadMoreReactions$!: Observable<boolean>;

  protected readonly profile = this.store.selectSnapshot(UserSelectors.profileOwner);

  public constructor(private readonly store: Store) {}
}
