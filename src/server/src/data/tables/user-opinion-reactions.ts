import {Table} from '../../typings/data/data.interfaces';

export const UserOpinionReactionsTable: Table = {
  name: 'user_opinion_reactions',
  query: `
    CREATE TABLE IF NOT EXISTS user_opinion_reactions (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id)
        ON DELETE CASCADE,
      opinion_id BIGINT NOT NULL REFERENCES user_opinions(id)
        ON DELETE CASCADE,
      reaction SMALLINT NOT NULL,
      comment VARCHAR (1000) DEFAULT NULL,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `,
};

// export const UserOpinionCommentsTable: Table = {
//   name: 'user_opinion_comments',
//   query: `
//     CREATE TABLE IF NOT EXISTS user_opinion_comments (
//       id BIGSERIAL PRIMARY KEY,
//       user_id BIGINT NOT NULL REFERENCES users(id)
//         ON DELETE CASCADE,
//       opinion_id BIGINT NOT NULL REFERENCES user_opinions(id)
//         ON DELETE CASCADE,
//       reaction_id BIGINT NOT NULL REFERENCES user_reactions(id)
//         ON DELETE CASCADE,
//       body VARCHAR (1000) NOT NULL,
//       reaction SMALLINT NOT NULL,
//       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
//     );
//   `,
// };
