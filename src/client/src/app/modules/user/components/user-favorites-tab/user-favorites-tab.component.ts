import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngxs/store';
import {UserSelectors} from '~app/modules/user/store/user.selectors';

@Component({
  selector: 'app-user-favorites-tab',
  templateUrl: './user-favorites-tab.component.html',
  styleUrls: ['./user-favorites-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFavoritesTabComponent {
  protected readonly profile = this.store.selectSnapshot(UserSelectors.isProfilePath);

  public constructor(private readonly store: Store) {}
}
