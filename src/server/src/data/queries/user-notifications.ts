import {QueryConfig} from 'pg';

export const queryUserNotifications = (userId: string): QueryConfig => ({
  text: `
    SELECT type, involved_user_id, created_at
    FROM user_notifications
    WHERE user_id = $1
  `,
  values: [userId],
});