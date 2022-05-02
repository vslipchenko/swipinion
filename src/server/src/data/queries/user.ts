import {QueryConfig} from 'pg';
import {Language} from '../../typings/i18n/i18n.types';
import {CreateUser} from '../../typings/user/user.interfaces';

export const queryUserCheckExistenceByEmail = (email: string): QueryConfig => ({
  text: `
    SELECT 1
    FROM users
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

export const queryUserCreate = ({
  username,
  email,
  password,
  accessKey,
  confirmationKey,
  language,
}: CreateUser & {accessKey: string; confirmationKey: string; language: Language}): QueryConfig => ({
  text: `
    INSERT INTO users (username, email, password, access_key, confirmation_key, language)
      VALUES ($1, $2, $3, $4, $5, $6)
  `,
  values: [username, email, password, accessKey, confirmationKey, language],
});

export const queryUserDeleteByEmail = (email: string): QueryConfig => ({
  text: `
    DELETE FROM users WHERE email = $1
  `,
  values: [email],
});

export const queryUserConfirmAccount = (key: string): QueryConfig => ({
  text: `
    UPDATE users
    SET confirmation_key = NULL
    WHERE confirmation_key = $1
  `,
  values: [key],
});

export const queryUserResetPassword = (email: string, password: string): QueryConfig => ({
  text: `
    UPDATE users
    SET password = $1
    WHERE email = $2
  `,
  values: [password, email],
});
