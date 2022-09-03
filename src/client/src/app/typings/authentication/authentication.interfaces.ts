import {SignInFailReason} from './authentication.enums';

export interface SignInQueryResult {
  signIn: {
    accessToken: string;
    refreshToken: string;
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
  };
}

export interface AccessTokenData {
  userId: string;
}
