import {Observable} from 'rxjs';

export interface GetUserNotificationsQueryResult {
  userNotifications: Array<Notification>;
}

export interface Notification {
  type: number;
  username: string;
  thumbnail: string;
  created_at: number;
}

export interface UINotification {
  type: number;
  username: string;
  thumbnail: string;
  timeElapsed$: Observable<string>;
  created_at: number;
}
