import {QueryConfig} from 'pg';

export const queryUserStatus = (userId: string): QueryConfig => ({
  text: `
    SELECT a.receiver_id,
      b.user_id
    FROM
      (SELECT receiver_id
        FROM user_messages
        WHERE receiver_id = ${userId}
          AND read = FALSE) AS a
    FULL OUTER JOIN
      (SELECT user_id
        FROM user_notifications
        WHERE user_id = ${userId}
          AND read = FALSE) AS b ON a.receiver_id = b.user_id
  `,
  values: [userId],
});
