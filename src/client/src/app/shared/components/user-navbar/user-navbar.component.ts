import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Observable} from 'rxjs';
import {UserProfile} from '~app/typings/user/user.interfaces';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNavbarComponent {
  @Select(AppSelectors.userProfile)
  public readonly userProfile$!: Observable<UserProfile>;

  public constructor(private readonly store: Store) {}
}
