import {QueryConfig} from 'pg';

export const queryCompleteUserStatus = (userId: string): QueryConfig => ({
  text: `
    SELECT a.receiver_id,
      b.user_id
    FROM
      (SELECT receiver_id
        FROM user_messages
        WHERE receiver_id = $1
          AND read = FALSE) AS a
    FULL OUTER JOIN
      (SELECT user_id
        FROM user_notifications
        WHERE user_id = $1
          AND read = FALSE) AS b ON a.receiver_id = b.user_id
  `,
  values: [userId],
});

export const queryNotificationUserStatus = (userId: string): QueryConfig => ({
  text: `
    SELECT 1
    FROM user_notifications
    WHERE user_id = $1
      AND read = FALSE
  `,
  values: [userId],
});

export const queryMessageUserStatus = (userId: string): QueryConfig => ({
  text: `
    SELECT 1
    FROM user_messages
    WHERE receiver_id = $1
      AND read = FALSE
  `,
  values: [userId],
});
