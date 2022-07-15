import {QueryConfig} from 'pg';
import {FollowSettings} from '../../typings/user-settings/user-settings.enums';

export const queryFollowUser = (userId: string, followerId: string): QueryConfig => ({
  text: `
    INSERT INTO followers
    (user_id, follower_id, pending)
    VALUES ($1, $2, (SELECT EXISTS (SELECT FROM user_settings WHERE user_id = $1 AND follow = ${FollowSettings.ByApprove})))
    RETURNING pending
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
