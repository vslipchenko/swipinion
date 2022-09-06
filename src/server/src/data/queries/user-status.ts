import {QueryConfig} from 'pg';

// export const queryCompleteUserStatus = (userId: string): QueryConfig => ({
//   text: `
//     SELECT a.created_at AS message_created_at,
//       b.created_at AS notification_created_at
//     FROM
//       (SELECT recipient_id, created_at
//         FROM user_messages
//         WHERE recipient_id = $1
//           AND read = FALSE) AS a
//     FULL OUTER JOIN
//       (SELECT user_id, created_at
//         FROM user_notifications
//         WHERE user_id = $1
//           AND read = FALSE) AS b ON a.recipient_id = b.user_id
//   `,
//   values: [userId],
// });

export const queryNotificationUserStatus = (userId: string): QueryConfig => ({
  text: `
    SELECT MAX(id) as id 
    FROM user_notifications
    WHERE user_id = $1
      AND read = FALSE
  `,
  values: [userId],
});

export const queryMessageUserStatus = (userId: string): QueryConfig => ({
  text: `
    SELECT id, sender_id
    FROM user_messages
    WHERE recipient_id = $1
      AND read = FALSE
    ORDER BY id DESC
  `,
  values: [userId],
});
