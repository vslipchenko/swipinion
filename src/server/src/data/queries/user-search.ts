import {QueryConfig} from 'pg';

export const queryUserSearchByUsername = (username: string, userId: string): QueryConfig => ({
  text: `
  `,
  values: [username, userId],
});
