import {QueryConfig} from 'pg';

export const queryUserSettings = (userId: string): QueryConfig => ({
  text: `
    SELECT follow, view_following, message, view_opinions, view_reactions, view_favorites
    FROM user_settings
    WHERE user_id = $1
  `,
  values: [userId],
});
