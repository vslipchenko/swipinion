import {Table} from '../../typings/data/data.interfaces';

export const UserFavoriteOpinionsTable: Table = {
  name: 'user_favorite_opinions',
  query: `
    CREATE TABLE IF NOT EXISTS user_favorite_opinions (
      id BIGSERIAL PRIMARY KEY,
      opinion_id BIGINT NOT NULL REFERENCES user_opinions(id)
        ON DELETE CASCADE,
      user_id BIGINT NOT NULL REFERENCES users(id)
        ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      UNIQUE (opinion_id, user_id)
    );
  `,
};
