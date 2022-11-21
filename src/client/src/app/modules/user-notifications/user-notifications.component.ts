import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject, takeUntil} from 'rxjs';
import {Actions, ofActionCompleted, ofActionErrored, Select, Store} from '@ngxs/store';
import {
  AcceptFollowRequest,
  DeclineFollowRequest,
  DeleteNotification,
  FetchUserNotifications,
} from '~app/modules/user-notifications/store/user-notifications.actions';
import {UserNotificationsSelectors} from '~app/modules/user-notifications/store/user-notifications.selectors';
import {UINotification} from '~app/typings/user-notifications/user-notifications.interfaces';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {AppSelectors} from '~app/modules/app/store/app.selectors';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNotificationsComponent implements OnInit, Destroyable {
  @Select(UserNotificationsSelectors.notifications) public notifications$!: Observable<Array<UINotification>>;
  @Select(UserNotificationsSelectors.canLoadMore) public canLoadMore$!: Observable<boolean>;

  public readonly loading$ = new BehaviorSubject(true);
  public readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly store: Store,
    private readonly snackbar: MatSnackBar,
    private readonly actions$: Actions,
  ) {
    this.actions$
      .pipe(
        takeUntil(this.destroy$),
        ofActionCompleted(FetchUserNotifications, AcceptFollowRequest, DeclineFollowRequest, DeleteNotification),
      )
      .subscribe(() => {
        this.loading$.next(false);
      });

    this.actions$
      .pipe(takeUntil(this.destroy$), ofActionErrored(AcceptFollowRequest, DeclineFollowRequest, DeleteNotification))
      .subscribe(() => {
        this.snackbar.open('Something went wrong. Please try again later', 'OK', {
          panelClass: 'snackbar-error',
        });
      });
  }

  public ngOnInit(): void {
    this.fetchUserNotifications('', Boolean(this.store.selectSnapshot(AppSelectors.unreadNotification)));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
