import {Table} from '../../typings/data/data.interfaces';

export const UserOpinionsTable: Table = {
  name: 'user_opinions',
  query: ` 
    CREATE TABLE IF NOT EXISTS user_opinions (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL,
      type SMALLINT NOT NULL,
      file_url VARCHAR (2048),
      description VARCHAR (3000),
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );
  `, // TODO rename description column -> text
};
