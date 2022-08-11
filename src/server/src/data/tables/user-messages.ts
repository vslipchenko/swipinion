import {Table} from '../../typings/data/data.interfaces';

export const UserMessagesTable: Table = {
  name: 'user_messages',
  query: `
    CREATE TABLE IF NOT EXISTS user_messages (
      id BIGSERIAL PRIMARY KEY,
      sender_id BIGINT REFERENCES users(id) ON DELETE SET NULL,  -- Preserve messages even of deleted users
      recipient_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
      body VARCHAR (3000) NOT NULL,
      teaser VARCHAR (150) NOT NULL, -- Used for the sake of conversation fetching optimization
      read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `,
};
