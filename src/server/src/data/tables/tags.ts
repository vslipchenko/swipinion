import {Table} from '../../typings/data/data.interfaces';

export const TagsTable: Table = {
  name: 'tags',
  query: `
    CREATE TABLE IF NOT EXISTS tags (
      id BIGSERIAL PRIMARY KEY,
      tag VARCHAR (35) NOT NULL,
      opinion_id BIGINT, -- TODO this could possibly be NOT NULL (depends on whether this table is able to store tag that is non-related to opinion onlys)
        FOREIGN KEY(opinion_id)
        REFERENCES user_opinions(id)
        ON DELETE CASCADE
    );
  `,
};
