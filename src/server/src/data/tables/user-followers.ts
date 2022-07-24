import {Table} from '../../typings/data/data.interfaces';

export const FollowersTable: Table = {
  name: 'user_followers',
  query: `
    CREATE TABLE IF NOT EXISTS user_followers (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id)
        ON DELETE CASCADE,
      follower_id BIGINT NOT NULL REFERENCES users(id)
        ON DELETE CASCADE,
      pending BOOLEAN NOT NULL,
      UNIQUE (user_id, follower_id)
    );
  `,
};
