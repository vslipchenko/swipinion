import {QueryConfig} from 'pg';
import {UserSettings} from '../../typings/user-settings/user-settings.interfaces';

export const queryUserSettings = (userId: string): QueryConfig => ({
  text: `
    SELECT follow, message, view_followers, view_following, view_opinions, view_reactions, view_favorites
    FROM user_settings
    WHERE user_id = $1
  `,
  values: [userId],
});

export const queryUpdateUserSettings = (
  userId: string,
  {follow, view_followers, view_following, message, view_opinions, view_reactions, view_favorites}: UserSettings,
): QueryConfig => ({
  text: `
    UPDATE user_settings
    SET follow = $2, message = $3, view_followers = $4, view_following = $5, view_opinions = $6, view_reactions = $7, view_favorites = $8
    WHERE user_id = $1
  `,
  values: [userId, follow, message, view_followers, view_following, view_opinions, view_reactions, view_favorites],
});
