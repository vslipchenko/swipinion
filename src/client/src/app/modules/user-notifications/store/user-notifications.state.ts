import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {UserNotificationsService} from '~app/services/user-notifications/user-notifications.service';
import {FetchUserNotifications} from '~app/modules/user-notifications/store/user-notifications.actions';
import {
  GetUserNotificationsQueryResult,
  Notification,
} from '~app/typings/user-notifications/user-notifications.interfaces';
import {MutationResult} from 'apollo-angular';
import {USER_NOTIFICATIONS_FETCH_LIMIT} from '~app/constants/user-notifications';

export interface UserNotificationsStateModel {
  notifications: Array<Notification>;
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
  public constructor(private readonly userNotificationsService: UserNotificationsService) {}

  @Action(FetchUserNotifications)
  private fetchUserNotifications(
    context: StateContext<UserNotificationsStateModel>,
    action: FetchUserNotifications,
  ): Observable<MutationResult<GetUserNotificationsQueryResult>> {
    return this.userNotificationsService.getNotifications(action.payload).pipe(
      tap(({data}) => {
        if (!data?.userNotifications) return;

        context.setState((state) => ({
          ...state,
          notifications: action.payload ? [...state.notifications, ...data.userNotifications] : data.userNotifications,
          canLoadMore: data.userNotifications.length === USER_NOTIFICATIONS_FETCH_LIMIT,
        }));
      }),
    );
  }
}
