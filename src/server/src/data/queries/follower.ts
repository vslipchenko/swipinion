import {QueryConfig} from 'pg';

export const queryFollowUser = (username: string, followerId: string): QueryConfig => ({
  text: `
    INSERT INTO followers
    (user_id, follower_id)
    VALUES ((SELECT id FROM users WHERE username = $1), $2)
  `,
  values: [username, followerId],
});