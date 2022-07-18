import {QueryConfig} from 'pg';
import {USER_NOTIFICATIONS_FETCH_LIMIT} from '../../constants/user-notifications';

export const queryUserNotifications = (userId: string, offset: number): QueryConfig => ({
  text: `
    SELECT type, involved_user_id, created_at
    FROM user_notifications
    WHERE user_id = $1
    LIMIT ${USER_NOTIFICATIONS_FETCH_LIMIT}
    OFFSET $2
  `,
  values: [userId, offset],
});
