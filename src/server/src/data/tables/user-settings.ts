import {Table} from '../../typings/data/data.interfaces';

export const UserSettingsTable: Table = {
  name: 'user_settings',
  query: `
    CREATE TABLE IF NOT EXISTS user_settings (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT,
      follow SMALLINT,
      view_following SMALLINT,
      message SMALLINT,
      view_opinions SMALLINT,
      view_reactions SMALLINT,
      view_favorites SMALLINT,
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );
  `,
};
