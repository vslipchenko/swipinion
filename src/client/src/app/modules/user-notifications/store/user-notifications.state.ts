import {State, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';

export interface UserNotificationsStateModel {
  notifications: Array<unknown>;
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
export class UserNotificationsState {}
