import {Table} from '../../typings/data/data.interfaces';

export const UserNotificationsTable: Table = {
  name: 'user_notifications',
  query: `
    CREATE TABLE IF NOT EXISTS user_notifications (
      id BIGSERIAL PRIMARY KEY,
      type SMALLINT,
      user_id BIGINT REFERENCES users(id)
        ON DELETE CASCADE,
      involved_user_id BIGINT REFERENCES users(id)
        ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
};
