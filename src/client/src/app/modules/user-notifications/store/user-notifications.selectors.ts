import {createSelector} from '@ngxs/store';
import {
  UserNotificationsState,
  UserNotificationsStateModel,
} from '~app/modules/user-notifications/store/user-notifications.state';
import {Notification} from '~app/typings/user-notifications/user-notifications.interfaces';

export class UserNotificationsSelectors {
  public static notifications = createSelector(
    [UserNotificationsState],
    (state: UserNotificationsStateModel): Array<Notification> => {
      return state.notifications;
    },
  );

  public static canLoadMore = createSelector(
    [UserNotificationsState],
    (state: UserNotificationsStateModel): boolean => {
      return state.canLoadMore;
    },
  );
}
