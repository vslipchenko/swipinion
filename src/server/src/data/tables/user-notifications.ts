import {Table} from '../../typings/data/data.interfaces';

export const UserNotificationsTable: Table = {
  name: 'user_notifications',
  query: `
    CREATE TABLE IF NOT EXISTS user_notifications (
      id BIGSERIAL PRIMARY KEY,
      type SMALLINT,                                     -- Type of notification
      user_id BIGINT NOT NULL REFERENCES users(id),      -- Prevents excessive join; Notification owner id
      involved_user_id BIGINT REFERENCES users(id),      -- Prevents excessive join; May be NULL
      follower_record_id BIGINT REFERENCES user_followers(id) -- Simple constraint that tells to delete record if parent table reference is gone; May be NULL
        ON DELETE CASCADE,
      read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
};
