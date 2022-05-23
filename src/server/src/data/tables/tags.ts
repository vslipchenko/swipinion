import {Table} from '../../typings/data/data.interfaces';

export const TagsTable: Table = {
  name: 'tags',
  query: `
    CREATE TABLE IF NOT EXISTS tags (
      id BIGSERIAL PRIMARY KEY,
      tag VARCHAR (35),
      opinion_id BIGINT,
        FOREIGN KEY(opinion_id)
        REFERENCES opinions(id)
        ON DELETE CASCADE
    );
  `,
};
