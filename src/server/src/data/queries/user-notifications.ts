import {QueryConfig} from 'pg';
import {USER_NOTIFICATIONS_FETCH_LIMIT} from '../../constants/user-notifications';

export const queryUserNotifications = (userId: string, offset: number): QueryConfig => ({
  text: `
    SELECT users.username, users.thumbnail, user_notifications.id, user_notifications.type, user_notifications.follower_record_id, user_notifications.read, user_notifications.created_at
    FROM user_notifications
    LEFT JOIN users ON users.id = user_notifications.involved_user_id
    WHERE user_id = $1
    LIMIT $3
    OFFSET $2
  `,
  values: [userId, offset, USER_NOTIFICATIONS_FETCH_LIMIT],
});

export const queryDeleteNotificationByFollowersRecordId = (recordId: string, userId: string): QueryConfig => ({
  text: `
    DELETE
    FROM user_notifications
    WHERE follower_record_id = $1 AND user_id = $2
  `,
  values: [recordId, userId],
});

export const queryDeleteNotificationById = (id: string, userId: string): QueryConfig => ({
  text: `
    DELETE
    FROM user_notifications
    WHERE id = $1 AND user_id = $2
  `,
  values: [id, userId],
});
