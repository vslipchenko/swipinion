import {Observable} from 'rxjs';
import {SuccessResponse} from '~app/typings/response/response.interfaces';

export interface GetUserNotificationsQueryResult {
  userNotifications: Array<Notification>;
}

export interface DeleteNotificationMutationResult {
  deleteNotification: SuccessResponse;
}

export interface Notification {
  id: string;
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
