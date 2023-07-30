import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Actions, ofActionCompleted, ofActionErrored, Select, Store} from '@ngxs/store';
import {
  AcceptFollowRequest,
  DeclineFollowRequest,
  DeleteNotification,
  FetchUserNotifications,
} from '~app/modules/user-notifications/store/user-notifications.actions';
import {UserNotificationsSelectors} from '~app/modules/user-notifications/store/user-notifications.selectors';
import {UINotification} from '~app/typings/user-notifications/user-notifications.interfaces';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {untilDestroyed} from '~app/utilities/operator';
import {UserStatusPingService} from '~app/services/user-status-ping/user-status-ping.service';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNotificationsComponent implements OnInit, OnDestroy {
  @Select(UserNotificationsSelectors.notifications) protected readonly notifications$!: Observable<
    Array<UINotification>
  >;
  @Select(UserNotificationsSelectors.canLoadMore) protected readonly canLoadMore$!: Observable<boolean>;

  protected readonly loading$ = new BehaviorSubject(true);
  private readonly untilDestroyed = untilDestroyed();

  public constructor(
    private readonly store: Store,
    private readonly snackbar: MatSnackBar,
    private readonly userStatusPingService: UserStatusPingService,
    private readonly actions$: Actions,
  ) {
    this.userStatusPingService.pingOptions = {
      ...this.userStatusPingService.pingOptions,
      checkNotification: false, // Set false in case if navigating from another page instead of direct navigation
    };

    this.actions$
      .pipe(
        this.untilDestroyed(),
        ofActionCompleted(FetchUserNotifications, AcceptFollowRequest, DeclineFollowRequest, DeleteNotification),
      )
      .subscribe(() => {
        this.loading$.next(false);
      });

    this.actions$
      .pipe(this.untilDestroyed(), ofActionErrored(AcceptFollowRequest, DeclineFollowRequest, DeleteNotification))
      .subscribe(() => {
        this.snackbar.open('Something went wrong. Please try again later', 'OK', {
          panelClass: 'snackbar-error',
        });
      });
  }

  public ngOnInit(): void {
    this.fetchUserNotifications('', true);
  }

  public ngOnDestroy(): void {
    this.userStatusPingService.pingOptions = {
      ...this.userStatusPingService.pingOptions,
      checkNotification: true, // Reset flag while navigating away
    };

    this.loading$.complete();
  }

  public acceptFollowRequest(notification: UINotification): void {
    this.loading$.next(true);

    this.store.dispatch(new AcceptFollowRequest(notification.follower_record_id));
  }

  public declineFollowRequest(notification: UINotification): void {
    this.loading$.next(true);

    this.store.dispatch(new DeclineFollowRequest(notification.follower_record_id));
  }

  public deleteNotification(notification: UINotification): void {
    this.loading$.next(true);

    this.store.dispatch(new DeleteNotification(notification.id));
  }

  protected spinnerInView(inView: boolean, notifications: Array<UINotification>): void {
    if (!inView) return;

    const edgeId = notifications[notifications.length - 1].id;

    this.fetchUserNotifications(edgeId);
  }

  private fetchUserNotifications(edgeId: string, markRead = false): void {
    this.store.dispatch(
      new FetchUserNotifications(
        edgeId
          ? {
              edgeId,
              markRead,
            }
          : // : ({markRead} as FetchUserNotificationsPayload),
            {markRead},
      ),
    );
  }
}
