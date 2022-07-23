import {QueryConfig} from 'pg';

export const querySendUserMessage = (senderId: string, receiverId: string, body: string): QueryConfig => ({
  text: `
    INSERT INTO user_messages
    (sender_id, receiver_id, body)
    VALUES ($1, $2, $3)
  `,
  values: [senderId, receiverId, body],
});
