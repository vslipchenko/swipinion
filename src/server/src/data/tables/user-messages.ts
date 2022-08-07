import {Table} from '../../typings/data/data.interfaces';

export const UserMessagesTable: Table = {
  name: 'user_messages',
  query: `
    CREATE TABLE IF NOT EXISTS user_messages (
      id BIGSERIAL PRIMARY KEY,
      sender_id BIGINT NOT NULL REFERENCES users(id),  -- Preserve messages even of deleted users
      receiver_id BIGINT NOT NULL REFERENCES users(id),
      body VARCHAR (3000) NOT NULL,
      teaser VARCHAR (150) NOT NULL, -- Used for the sake of conversation fetching optimization
      read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `,
};
