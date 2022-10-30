import {QueryConfig} from 'pg';
import {PrivacyCommonSettings} from '../../typings/user-settings/user-settings.enums';

export const queryUserSearchByUsername = (username: string, userId: string): QueryConfig => ({
  text: `
    SELECT users.id, users.username, users.thumbnail
    FROM users
    LEFT JOIN user_settings ON users.id = user_settings.user_id
    LEFT JOIN user_followers ON users.id = user_followers.user_id
    WHERE (user_settings.message = ${PrivacyCommonSettings.Everyone} OR user_settings.message = ${PrivacyCommonSettings.FollowersOnly} AND user_followers.follower_id = $2) 
      AND users.username LIKE '%' || $1 || '%'
  `,
  values: [username, userId],
});
