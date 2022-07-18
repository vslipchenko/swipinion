import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Store} from '@ngxs/store';
import {FetchUserNotifications} from '~app/modules/user-notifications/store/user-notifications.actions';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNotificationsComponent implements OnInit {
  public readonly loading$ = new BehaviorSubject(false);

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(new FetchUserNotifications(0));
  }
}
