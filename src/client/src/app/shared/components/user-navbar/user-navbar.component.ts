import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Observable} from 'rxjs';
import {UserProfile} from '~app/typings/user/user.interfaces';
import {MenuItem} from '~app/typings/menu/menu.interfaces';
import {MatDialog} from '@angular/material/dialog';
import {AddOpinionDialogComponent} from '~app/shared/components/add-opinion-dialog/add-opinion-dialog.component';
import {AuthenticationService} from '~app/services/authentication/authentication.service';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNavbarComponent {
  @Select(AppSelectors.authedUserProfileTeaser)
  public readonly authedUserProfileTeaser$!: Observable<UserProfile>;

  public readonly navbarItems: Array<MenuItem> = [
    {title: 'Share opinion', icon: 'post_add', click: (): void => this.shareOpinion()},
    {title: 'Profile', routerLink: '/profile', icon: 'person'},
    {title: 'Messages', routerLink: '/profile/messages', svgIcon: 'email-multiple'},
    // {title: 'Search', routerLink: '/search', icon: 'search'},
    {title: 'Notifications', routerLink: '/profile/notifications', icon: 'notifications'},
    {title: 'Settings', routerLink: '/profile/settings', icon: 'settings'},
    {
      title: 'Logout',
      icon: 'logout',
      color: 'warn',
      click: (): void => this.authenticationService.logout(),
    },
  ];

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly authenticationService: AuthenticationService,
  ) {}

  public shareOpinion(): void {
    this.dialog.open(AddOpinionDialogComponent, {panelClass: ['dialog', 'extended-dialog']});
  }
}
