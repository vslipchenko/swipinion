import {Table} from '../../typings/data/data.interfaces';

export const UsersTable: Table = {
  name: 'users',
  // access_key is used in order to bring diversity to tokens being used; that helps to revoke someone's specific token
  query: `
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      access_key CHAR (24),
      confirmation_code CHAR (6),
      recovery_code CHAR (6),
      thumbnail VARCHAR (2048),
      bio VARCHAR (300),
      username VARCHAR (30) UNIQUE NOT NULL,
      email VARCHAR (254) UNIQUE NOT NULL,
      password CHAR (60) NOT NULL,
      language CHAR (2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `,
};
