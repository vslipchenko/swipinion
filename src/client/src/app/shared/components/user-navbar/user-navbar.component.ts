import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Observable} from 'rxjs';
import {UserProfile} from '~app/typings/user/user.interfaces';
import {MenuItem} from '~app/typings/menu/menu.interfaces';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNavbarComponent {
  @Select(AppSelectors.userProfile)
  public readonly userProfile$!: Observable<UserProfile>;

  public readonly navbarItems: Array<MenuItem> = [
    {title: 'Share opinion', icon: 'post_add'},
    {title: 'Profile', routerLink: '/profile', icon: 'person'},
    {title: 'Logout', icon: 'logout', color: 'warn', click: (): void => {}},
  ];

  public constructor(private readonly store: Store) {}
}
