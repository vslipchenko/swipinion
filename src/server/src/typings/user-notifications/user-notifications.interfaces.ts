import {NotificationType} from './user-notifications.enums';

export interface Notification {
  type: NotificationType;
  involved_user_id: string;
  created_at: string;
}
