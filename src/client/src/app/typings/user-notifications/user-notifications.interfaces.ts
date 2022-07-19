import {Observable} from 'rxjs';

export interface GetUserNotificationsQueryResult {
  userNotifications: Array<Notification>;
}

export interface Notification {
  type: number;
  username: string;
  thumbnail: string;
  follower_record_id: string;
  created_at: number;
}

export interface UINotification extends Notification {
  text: string;
  timeElapsed$: Observable<string>;
}
