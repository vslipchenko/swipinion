import {Table} from '../../typings/data/data.interfaces';

export const UserSettingsTable: Table = {
  name: 'user_settings',
  query: `
    CREATE TABLE IF NOT EXISTS user_settings (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL,
      message SMALLINT NOT NULL,
      follow SMALLINT NOT NULL,
      view_followers SMALLINT NOT NULL,
      view_following SMALLINT NOT NULL,
      view_opinions SMALLINT NOT NULL,
      view_reactions SMALLINT NOT NULL,
      view_favorites SMALLINT NOT NULL,
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );
  `,
};
