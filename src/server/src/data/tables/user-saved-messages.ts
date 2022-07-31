import {Table} from '../../typings/data/data.interfaces';

export const UserSavedMessagesTable: Table = {
  name: 'user_saved_messages', // Reasons of having a separate table are: When user deletes his account it is straightforward to drop saved messages; When sql is made against user_messages table it won't do useless search through saved messages as well
  query: `
    CREATE TABLE IF NOT EXISTS user_saved_messages (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Preserve messages even of deleted users
      body VARCHAR (3000) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `,
};
