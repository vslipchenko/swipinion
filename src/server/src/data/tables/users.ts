import {Table} from '../../typings/data/data.interfaces';

export const UsersTable: Table = {
  name: 'users',
  // access_key is used in order to bring diversity to tokens being used; that helps to revoke someone's specific token
  query: `
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      access_key CHAR (24),
      confirmation_key CHAR (36) UNIQUE,
      username VARCHAR (30) UNIQUE,
      email VARCHAR (254) UNIQUE,
      password CHAR (60),
      language CHAR (2),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
};
