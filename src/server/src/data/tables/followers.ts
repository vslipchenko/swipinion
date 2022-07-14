import {Table} from '../../typings/data/data.interfaces';

export const FollowersTable: Table = {
  name: 'followers',
  query: `
    CREATE TABLE IF NOT EXISTS followers (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(id)
        ON DELETE CASCADE,
      follower_id BIGINT REFERENCES users(id)
        ON DELETE CASCADE,
      pending BOOLEAN,
      UNIQUE (user_id, follower_id)
    );
  `,
};
