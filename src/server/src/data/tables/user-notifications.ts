import {Table} from '../../typings/data/data.interfaces';

export const UserNotificationsTable: Table = {
  name: 'user_notifications',
  query: `
    CREATE TABLE IF NOT EXISTS user_notifications (
      id BIGSERIAL PRIMARY KEY,
      type SMALLINT,                                     -- Type of notification
      user_id BIGINT REFERENCES users(id),               -- Prevents excessive join
      involved_user_id BIGINT REFERENCES users(id),      -- Prevents excessive join
      follower_record_id BIGINT REFERENCES user_followers(id) -- Simple constraint that tells to delete record if parent table reference is gone
        ON DELETE CASCADE,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
};
