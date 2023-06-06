import {TokenExpiredError, verify} from 'jsonwebtoken';
import {environment} from '../environments';
import {ApolloError} from 'apollo-server-fastify';
import {JWT_ALGORITHM} from '../constants/jwt';
import {AccessTokenData} from '../typings/authentication/authentication.interfaces';
import {AuthenticationErrorCode} from '../typings/authentication/authentication.enums';

interface AuthenticationGuardResult {
  error: ApolloError;
  tokenData: AccessTokenData;
}

export const authenticationGuard = (accessToken: string): AuthenticationGuardResult => {
  if (!accessToken) {
    return {
      error: new ApolloError('', AuthenticationErrorCode.EmptyAccessToken),
    } as AuthenticationGuardResult;
  }

  try {
    const tokenData = verify(accessToken, environment.ACCESS_TOKEN_SECRET, {algorithms: [JWT_ALGORITHM]});
    return {tokenData} as AuthenticationGuardResult;
  } catch (error) {
    // The only legit error
    if (error instanceof TokenExpiredError) {
      return {
        error: new ApolloError('', AuthenticationErrorCode.ExpiredAccessToken),
      } as AuthenticationGuardResult;
    }

    return {
      error: new ApolloError('', AuthenticationErrorCode.InvalidAccessToken),
    } as AuthenticationGuardResult;
  }
};

export const expiredAccessTokenError = (error: ApolloError | undefined): boolean =>
  error?.extensions.code === AuthenticationErrorCode.ExpiredAccessToken;
