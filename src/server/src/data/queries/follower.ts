import {QueryConfig} from 'pg';

export const queryFollowUser = (userId: string, followerId: string): QueryConfig => ({
  text: `
    INSERT INTO followers
    (user_id, follower_id)
    VALUES ($1, $2)
  `,
  values: [userId, followerId],
});

export const queryUnfollowUser = (userId: string, followerId: string): QueryConfig => ({
  text: `
    DELETE FROM followers
    WHERE user_id = $1 AND follower_id = $2
  `,
  values: [userId, followerId],
});
