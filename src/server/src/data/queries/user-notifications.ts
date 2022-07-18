import {QueryConfig} from 'pg';
import {USER_NOTIFICATIONS_FETCH_LIMIT} from '../../constants/user-notifications';

export const queryUserNotifications = (userId: string, offset: number): QueryConfig => ({
  text: `
    SELECT users.username, users.thumbnail, user_notifications.type, user_notifications.read, user_notifications.created_at
    FROM user_notifications
    LEFT JOIN users ON users.id = user_notifications.involved_user_id
    WHERE user_id = $1
    LIMIT ${USER_NOTIFICATIONS_FETCH_LIMIT}
    OFFSET $2
  `,
  values: [userId, offset],
});
