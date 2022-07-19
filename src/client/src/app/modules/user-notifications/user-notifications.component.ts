import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {FetchUserNotifications} from '~app/modules/user-notifications/store/user-notifications.actions';
import {UserNotificationsSelectors} from '~app/modules/user-notifications/store/user-notifications.selectors';
import {UINotification} from '~app/typings/user-notifications/user-notifications.interfaces';
import {NotificationType} from '~app/typings/user-notifications/user-notifications.enums';
import {MenuItem} from '~app/typings/menu/menu.interfaces';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNotificationsComponent implements OnInit {
  @Select(UserNotificationsSelectors.notifications) public notifications$!: Observable<Array<UINotification>>;
  public readonly loading$ = new BehaviorSubject(false);

  public followRequestOptions: Array<MenuItem> = [
    {title: 'Accept', icon: 'done', color: 'primary', click: (): void => this.acceptFollowRequest()},
    {title: 'Decline', icon: 'close', color: 'warn', click: (): void => this.declineFollowRequest()},
  ];

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(new FetchUserNotifications(0));
  }

  public hasOptions(type: NotificationType): boolean {
    return type === NotificationType.FollowRequest;
  }

  private acceptFollowRequest(): void {}

  private declineFollowRequest(): void {}
}
