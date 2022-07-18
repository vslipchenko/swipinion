import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {FetchUserNotifications} from '~app/modules/user-notifications/store/user-notifications.actions';
import {UserNotificationsSelectors} from '~app/modules/user-notifications/store/user-notifications.selectors';
import {Notification} from '~app/typings/user-notifications/user-notifications.interfaces';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNotificationsComponent implements OnInit {
  @Select(UserNotificationsSelectors.notifications) public notifications$!: Observable<Array<Notification>>;
  public readonly loading$ = new BehaviorSubject(false);

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(new FetchUserNotifications(0));
  }
}
