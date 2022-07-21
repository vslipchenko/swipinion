import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Observable, Subject, takeUntil} from 'rxjs';
import {UserProfile} from '~app/typings/user/user.interfaces';
import {MenuItem} from '~app/typings/menu/menu.interfaces';
import {MatDialog} from '@angular/material/dialog';
import {AddOpinionDialogComponent} from '~app/shared/components/add-opinion-dialog/add-opinion-dialog.component';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {UserNavbarService} from '~app/services/user-navbar/user-navbar.service';
import {Destroyable} from '~app/typings/component/component.interfaces';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNavbarComponent implements Destroyable {
  @Select(AppSelectors.authedUserProfileTeaser)
  public readonly authedUserProfileTeaser$!: Observable<UserProfile>;
  public readonly destroy$ = new Subject<void>();

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
    private readonly userNavbarService: UserNavbarService,
  ) {
    this.userNavbarService.shareOpinion$.pipe(takeUntil(this.destroy$)).subscribe(() => this.shareOpinion());
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public shareOpinion(): void {
    this.dialog.open(AddOpinionDialogComponent, {panelClass: ['dialog', 'extended-dialog']});
  }
}
