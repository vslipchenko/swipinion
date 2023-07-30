import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserProfile} from '~app/typings/user/user.interfaces';
import {MenuItem} from '~app/typings/menu/menu.interfaces';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {AddOpinionDialogComponent} from '~app/shared/components/add-opinion-dialog/add-opinion-dialog.component';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {UserNavbarService} from '~app/services/user-navbar/user-navbar.service';
import {untilDestroyed} from '~app/utilities/operator';
import {UserStatus} from '~app/typings/user-status/user-status.interfaces';
import {UserNavbarMenuItem} from '~app/typings/menu/menu.enums';
import {AsyncPipe, NgIf} from '@angular/common';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MenuItemsComponent} from '~app/shared/components/menu-items/menu-items.component';
import {ThumbnailComponent} from '~app/shared/components/thumbnail/thumbnail.component';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, MatMenuModule, MenuItemsComponent, ThumbnailComponent],
})
export class UserNavbarComponent implements OnInit {
  @Select(AppSelectors.userEssentials)
  protected readonly authedUserProfileTeaser$!: Observable<UserProfile>;
  @Select(AppSelectors.userStatus) protected readonly status$!: Observable<UserStatus>;

  protected readonly navbarItems$ = new BehaviorSubject([
    {
      id: UserNavbarMenuItem.ShareOpinion,
      title: 'Add opinion',
      icon: 'post_add',
      click: (): void => this.addOpinion(),
    },
    {id: UserNavbarMenuItem.Profile, title: 'Profile', routerLink: '/profile', icon: 'person'},
    {id: UserNavbarMenuItem.Messages, title: 'Messages', routerLink: '/profile/messages', svgIcon: 'email-multiple'},
    // {title: 'Search', routerLink: '/search', icon: 'search'},
    {
      id: UserNavbarMenuItem.Notifications,
      title: 'Notifications',
      routerLink: '/profile/notifications',
      icon: 'notifications',
    },
    {id: UserNavbarMenuItem.Settings, title: 'Settings', routerLink: '/profile/settings', icon: 'settings'},
    {
      id: UserNavbarMenuItem.Logout,
      title: 'Logout',
      icon: 'logout',
      color: 'warn',
      click: (): void => this.authenticationService.logout(),
    },
  ] as Array<MenuItem>);
  protected indicatorClass = '';

  private readonly untilDestroyed = untilDestroyed();

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly authenticationService: AuthenticationService,
    private readonly userNavbarService: UserNavbarService,
  ) {
    this.userNavbarService.shareOpinion$.pipe(this.untilDestroyed()).subscribe(() => this.addOpinion());
  }

  public ngOnInit(): void {
    this.status$.pipe(this.untilDestroyed()).subscribe((status) => {
      this.indicatorClass = this.defineIndicatorClass(status);

      this.navbarItems$.next(
        this.navbarItems$.value.map((item) => {
          if (item.id === UserNavbarMenuItem.Messages) {
            return {
              ...item,
              color: status.hasUnreadMessage ? 'primary' : undefined,
            };
          } else if (item.id === UserNavbarMenuItem.Notifications) {
            return {
              ...item,
              color: status.hasUnreadNotification ? 'accent' : undefined,
            };
          }

          return item;
        }),
      );
    });
  }

  public addOpinion(): void {
    this.dialog.open(AddOpinionDialogComponent, {panelClass: ['dialog', 'small-dialog']});
  }

  private defineIndicatorClass({hasUnreadMessage, hasUnreadNotification}: UserStatus): string {
    if (hasUnreadMessage && hasUnreadNotification) return 'unread-both';

    if (hasUnreadMessage) return 'unread-message';

    if (hasUnreadNotification) return 'unread-notification';

    return '';
  }
}
