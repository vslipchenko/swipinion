import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject, takeUntil} from 'rxjs';
import {Actions, ofActionCompleted, ofActionErrored, Select, Store} from '@ngxs/store';
import {
  AcceptFollowRequest,
  DeclineFollowRequest,
  FetchUserNotifications,
} from '~app/modules/user-notifications/store/user-notifications.actions';
import {UserNotificationsSelectors} from '~app/modules/user-notifications/store/user-notifications.selectors';
import {UINotification} from '~app/typings/user-notifications/user-notifications.interfaces';
import {NotificationType} from '~app/typings/user-notifications/user-notifications.enums';
import {MenuItem} from '~app/typings/menu/menu.interfaces';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Destroyable} from '~app/typings/component/component.interfaces';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNotificationsComponent implements OnInit, Destroyable {
  @Select(UserNotificationsSelectors.notifications) public notifications$!: Observable<Array<UINotification>>;

  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();

  public followRequestOptions: Array<MenuItem> = [
    {title: 'Accept', icon: 'done', color: 'primary', click: this.acceptFollowRequest.bind(this)},
    {title: 'Decline', icon: 'close', color: 'warn', click: this.declineFollowRequest.bind(this)},
  ];

  public constructor(
    private readonly store: Store,
    private readonly snackbar: MatSnackBar,
    private readonly actions$: Actions,
  ) {
    this.actions$
      .pipe(takeUntil(this.destroy$), ofActionCompleted(AcceptFollowRequest, DeclineFollowRequest))
      .subscribe(() => {
        this.loading$.next(false);
      });

    this.actions$
      .pipe(takeUntil(this.destroy$), ofActionErrored(AcceptFollowRequest, DeclineFollowRequest))
      .subscribe(() => {
        this.snackbar.open('Something went wrong. Please try again later', 'OK', {
          panelClass: 'snackbar-error',
        });
      });
  }

  public ngOnInit(): void {
    this.store.dispatch(new FetchUserNotifications(0));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public hasOptions(type: NotificationType): boolean {
    return type === NotificationType.FollowRequest;
  }

  private acceptFollowRequest(notification: UINotification): void {
    this.loading$.next(true);

    this.store.dispatch(new AcceptFollowRequest(notification.follower_record_id));
  }

  private declineFollowRequest(notification: UINotification): void {
    this.loading$.next(true);

    this.store.dispatch(new DeclineFollowRequest(notification.follower_record_id));
  }
}
