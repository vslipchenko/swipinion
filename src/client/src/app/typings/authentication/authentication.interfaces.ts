import {SignInFailReason} from './authentication.enums';
import {Language} from '~app/typings/i18n/i18n.types';

export interface SignInQueryResult {
  signIn: {
    accessToken: string;
    refreshToken: string;
    thumbnail: string;
    bio: string;
    username: string;
    reason: SignInFailReason;
  };
}

export interface SignIn {
  email: string;
  password: string;
}

export interface AccessTokenByRefreshTokenQueryResult {
  refreshAccessToken: {
    accessToken: string;
    thumbnail: string;
    bio: string;
    username: string;
  };
}

export interface AccessTokenData {
  userId: string;
  language: Language;
}
