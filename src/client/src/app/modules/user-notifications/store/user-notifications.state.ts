import {Action, State, StateContext, StateToken, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {map, Observable, tap, throwError} from 'rxjs';
import {UserNotificationsService} from '~app/services/user-notifications/user-notifications.service';
import {
  AcceptFollowRequest,
  DeclineFollowRequest,
  DeleteNotification,
  FetchUserNotifications,
} from '~app/modules/user-notifications/store/user-notifications.actions';
import {
  GetUserNotificationsQueryResult,
  UINotification,
} from '~app/typings/user-notifications/user-notifications.interfaces';
import {MutationResult} from 'apollo-angular';
import {USER_NOTIFICATIONS_FETCH_LIMIT} from '~app/constants/user-notifications';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {
  determineElapsedTimeMeasure,
  millisecondsToDays,
  millisecondsToHours,
  millisecondsToMinutes,
} from '~app/utilities/date';
import {ElapsedTimeMeasure} from '~app/typings/date/date.enums';
import {NotificationType} from '~app/typings/user-notifications/user-notifications.enums';
import {FollowerService} from '~app/services/follower/follower.service';

export interface UserNotificationsStateModel {
  notifications: Array<UINotification>;
  canLoadMore: boolean;
}

const USER_NOTIFICATIONS_STATE = new StateToken<UserNotificationsStateModel>('userNotifications');

@State({
  name: USER_NOTIFICATIONS_STATE,
  defaults: {
    notifications: [],
    canLoadMore: false,
  },
})
@Injectable()
export class UserNotificationsState {
  public constructor(
    private readonly userNotificationsService: UserNotificationsService,
    private readonly followerService: FollowerService,
    private readonly store: Store,
  ) {}

  @Action(FetchUserNotifications)
  private fetchUserNotifications(
    context: StateContext<UserNotificationsStateModel>,
    action: FetchUserNotifications,
  ): Observable<MutationResult<GetUserNotificationsQueryResult>> {
    return this.userNotificationsService.getNotifications(action.payload).pipe(
      tap(({data}) => {
        if (!data?.userNotifications) return;

        const notifications: Array<UINotification> = data.userNotifications.map((notification) => {
          let text = '';

          if (notification.type === NotificationType.Followed) {
            text = 'Started following you';
          } else if (notification.type === NotificationType.FollowRequest) {
            text = 'Wants to follow you';
          }

          return {
            ...notification,
            text,
            timeElapsed$: this.store.select(AppSelectors.utcTimestamp).pipe(
              map((utcTimestamp) => {
                const millisecondsElapsed = utcTimestamp - notification.created_at;

                const measure = determineElapsedTimeMeasure(millisecondsElapsed);

                switch (measure) {
                  case ElapsedTimeMeasure.SECOND:
                    return 'Now';
                  case ElapsedTimeMeasure.MINUTE:
                    return `${millisecondsToMinutes(millisecondsElapsed)}m`;
                  case ElapsedTimeMeasure.HOUR:
                    return `${millisecondsToHours(millisecondsElapsed)}h`;
                  default: // TODO: Fix. This has to be a concrete date instead of days passed since
                    return `${millisecondsToDays(millisecondsElapsed)}d`;
                }
              }),
            ),
          };
        });

        context.setState((state) => ({
          ...state,
          notifications: action.payload ? [...state.notifications, ...notifications] : notifications,
          canLoadMore: data.userNotifications.length === USER_NOTIFICATIONS_FETCH_LIMIT,
        }));
      }),
    );
  }

  @Action(AcceptFollowRequest)
  private acceptFollowRequest(
    context: StateContext<UserNotificationsStateModel>,
    action: AcceptFollowRequest,
  ): Observable<unknown> {
    return this.followerService.acceptFollowRequest(action.payload).pipe(
      map((result) => {
        if (!result.data?.acceptFollowRequest?.success) return throwError('');

        context.setState((state) => ({
          ...state,
          notifications: state.notifications.filter(
            (notification) => notification.follower_record_id !== action.payload,
          ),
        }));

        return result;
      }),
    );
  }

  @Action(DeclineFollowRequest)
  private declineFollowRequest(
    context: StateContext<UserNotificationsStateModel>,
    action: DeclineFollowRequest,
  ): Observable<unknown> {
    return this.followerService.declineFollowRequest(action.payload).pipe(
      map((result) => {
        if (!result.data?.declineFollowRequest?.success) return throwError('');

        context.setState((state) => ({
          ...state,
          notifications: state.notifications.filter(
            (notification) => notification.follower_record_id !== action.payload,
          ),
        }));

        return result;
      }),
    );
  }

  @Action(DeleteNotification)
  private deleteNotification(
    context: StateContext<UserNotificationsStateModel>,
    action: DeleteNotification,
  ): Observable<unknown> {
    return this.userNotificationsService.deleteNotification(action.payload).pipe(
      map((result) => {
        if (!result.data?.deleteNotification?.success) return throwError('');

        context.setState((state) => ({
          ...state,
          notifications: state.notifications.filter((notification) => notification.id !== action.payload),
        }));

        return result;
      }),
    );
  }
}
