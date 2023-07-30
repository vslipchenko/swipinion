import {QueryConfig} from 'pg';
import {Language} from '../../typings/i18n/i18n.types';
import {CreateUser, SetNewPassword} from '../../typings/user/user.interfaces';
import {FollowSettings, PrivacyCommonSettings} from '../../typings/user-settings/user-settings.enums';

export const queryUserCheckExistenceByEmail = (email: string): QueryConfig => ({
  text: `
    SELECT 1
    FROM users
    WHERE email = $1
  `,
  values: [email],
});

export const queryUserWithRecoveryCodeByEmail = (email: string, code: string): QueryConfig => ({
  text: `
    SELECT 1
    FROM users
    WHERE email = $1 AND recovery_code = $2
  `,
  values: [email, code],
});

export const queryUserRecoverPassword = ({password, email, code}: SetNewPassword): QueryConfig => ({
  text: `
    UPDATE users
    SET recovery_code = NULL, password = $1
    WHERE email = $2 AND recovery_code = $3
  `,
  values: [password, email, code],
});

export const queryUserSetRecoveryCodeByEmail = (code: string, email: string): QueryConfig => ({
  text: `
    UPDATE users
    SET recovery_code = $1
    WHERE email = $2
  `,
  values: [code, email],
});

export const queryUserResetRecoveryCode = (email: string): QueryConfig => ({
  text: `
    UPDATE users
    SET recovery_code = NULL
    WHERE email = $1
  `,
  values: [email],
});

export const queryUserCheckExistenceByUsername = (username: string): QueryConfig => ({
  text: `
    SELECT 1
    FROM users
    WHERE username = $1
  `,
  values: [username],
});

export const queryUserEssentialsById = (userId: string): QueryConfig => ({
  text: `
    SELECT id, thumbnail, username, bio, language
    FROM users
    WHERE id = $1
  `,
  values: [userId],
});

export const queryUserCreate = ({
  username,
  email,
  password,
  accessKey,
  confirmationCode,
  language,
}: CreateUser & {
  accessKey: string;
  confirmationCode: string;
  language: Language;
}): QueryConfig => ({
  text: `
    WITH record AS (
      INSERT INTO users (username, email, password, access_key, confirmation_code, language)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    )
    INSERT INTO user_settings (user_id, follow, message, view_followers, view_following, view_opinions, view_reactions, view_favorites)
    VALUES ((SELECT id FROM record), ${FollowSettings.Everyone}, ${FollowSettings.Everyone}, ${PrivacyCommonSettings.Everyone}, ${PrivacyCommonSettings.Everyone}, ${PrivacyCommonSettings.Everyone}, ${PrivacyCommonSettings.Everyone}, ${PrivacyCommonSettings.Everyone})
  `,
  values: [username, email, password, accessKey, confirmationCode, language],
});

export const queryUserDeleteByEmail = (email: string): QueryConfig => ({
  text: `
    DELETE FROM users WHERE email = $1
  `,
  values: [email],
});

export const queryUserConfirmEmail = (email: string, code: string): QueryConfig => ({
  text: `
    UPDATE users
    SET confirmation_code = NULL
    WHERE email = $1 AND confirmation_code = $2
  `,
  values: [email, code],
});

export const queryUserPassword = (userId: string): QueryConfig => ({
  text: `
    SELECT password FROM users WHERE id = $1
  `,
  values: [userId],
});

export const queryUserChangePassword = (userId: string, newPassword: string): QueryConfig => ({
  text: `
    UPDATE users
    SET password = $2
    WHERE id = $1
  `,
  values: [userId, newPassword],
});

export const queryUserResetPassword = (email: string, password: string): QueryConfig => ({
  text: `
    UPDATE users
    SET password = $1
    WHERE email = $2
  `,
  values: [password, email],
});

export const queryUserSignIn = (email: string): QueryConfig => ({
  text: `
    SELECT id, password, access_key, confirmation_code
    FROM users
    WHERE email = $1
  `,
  values: [email],
});

export const queryUserRefreshAccessToken = (userId: string): QueryConfig => ({
  text: `
    SELECT access_key
    FROM users
    WHERE id = $1
  `,
  values: [userId],
});

export const queryUserEditProfile = ({
  userId,
  thumbnail,
  bio,
}: {
  userId: string;
  thumbnail: string;
  bio: string;
}): QueryConfig => ({
  text: `
    UPDATE users
    SET thumbnail = $1, bio = $2
    WHERE id = $3
  `,
  values: [thumbnail, bio, userId],
});

export const queryUserProfileCompleteData = (username: string, followerId: string): QueryConfig => ({
  text: `
    SELECT user_followers.follower_id, user_followers.pending, users.id, users.thumbnail, users.bio
    FROM users
    LEFT JOIN user_followers 
    ON users.id = user_followers.user_id AND user_followers.follower_id = $2
    WHERE users.username = $1
  `,
  values: [username, followerId],
});

export const queryUserProfileDataById = (userId: string): QueryConfig => ({
  text: `
    SELECT thumbnail, bio
    FROM users
    WHERE id = $1
  `,
  values: [userId],
});

export const queryUserProfileDataByUsername = (username: string): QueryConfig => ({
  text: `
    SELECT id, thumbnail, bio
    FROM users
    WHERE username = $1
  `,
  values: [username],
});
