import {Table} from '../../typings/data/data.interfaces';

export const UserMessagesTable: Table = {
  name: 'user_messages',
  query: `
    CREATE TABLE IF NOT EXISTS user_messages (
      id BIGSERIAL PRIMARY KEY,
      sender_id BIGINT,  -- Preserve messages even of deleted users
      receiver_id BIGINT,
      body VARCHAR (3000),
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
};
