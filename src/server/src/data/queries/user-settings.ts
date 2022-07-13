import {QueryConfig} from 'pg';
import {UserSettings} from '../../typings/user-settings/user-settings.interfaces';

export const queryUserSettings = (userId: string): QueryConfig => ({
  text: `
    SELECT follow, view_following, message, view_opinions, view_reactions, view_favorites
    FROM user_settings
    WHERE user_id = $1
  `,
  values: [userId],
});

export const queryUpdateUserSettings = (
  userId: string,
  {follow, view_following, message, view_opinions, view_reactions, view_favorites}: UserSettings,
): QueryConfig => ({
  text: `
    UPDATE user_settings
    SET follow = $2, view_following = $3, message = $4, view_opinions = $5, view_reactions = $6, view_favorites = $7
    WHERE user_id = $1
  `,
  values: [userId, follow, view_following, message, view_opinions, view_reactions, view_favorites],
});
