import {ApolloError, gql} from 'apollo-server-core';
import {AuthenticationErrorCode, SignInFailReason} from '../../../typings/authentication/authentication.enums';
import {AccessTokenData, SignIn} from '../../../typings/authentication/authentication.interfaces';
import {compareSync} from 'bcrypt';
import {decode, sign, verify} from 'jsonwebtoken';
import {JWT_ALGORITHM} from '../../../constants/jwt';
import {environment} from '../../../environments';
import {db} from '../../../data';
import {queryUserRefreshAccessToken, queryUserSignIn} from '../../../data/queries/user';
import {signInValidator} from '../../../validators/authentication';

export const authenticationQueryTypeDefinitions = gql`
  type Query {
    signIn(input: SignIn!): SignInResult
    refreshAccessToken(refreshToken: String!): RefreshAccessTokenResult
  }
`;

const signIn = async (
  _: unknown,
  {input}: {input: SignIn},
): Promise<
  {accessToken: string; refreshToken: string; thumbnail: string; username: string} | {reason: SignInFailReason} | null
> => {
  const {error} = signInValidator.validate(input);

  if (error) return null;

  const result = await db.query(queryUserSignIn(input.email));

  if (!result.rowCount) return null;

  const row = result.rows[0];

  if (!row.access_key) return {reason: SignInFailReason.Blocked};

  if (row.confirmation_code) return {reason: SignInFailReason.Unconfirmed};

  const correctPassword = compareSync(input.password, row.password);

  if (!correctPassword) return null;

  const accessToken = sign({userId: row.id, language: row.language}, environment.ACCESS_TOKEN_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: environment.ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = sign({userId: row.id}, `${environment.REFRESH_TOKEN_SECRET}${row.access_key}`, {
    algorithm: JWT_ALGORITHM,
    expiresIn: environment.REFRESH_TOKEN_EXPIRES_IN,
  });

  return {accessToken, refreshToken, thumbnail: row.thumbnail, username: row.username};
};

const refreshAccessToken = async (
  _: unknown,
  {refreshToken}: {refreshToken: string},
): Promise<ApolloError | {accessToken: string; thumbnail: string; username: string}> => {
  if (!refreshToken) return new ApolloError('', AuthenticationErrorCode.EmptyRefreshToken);

  const userId = (decode(refreshToken) as AccessTokenData)?.userId;
  // Invalid user id
  if (!userId) return new ApolloError('', AuthenticationErrorCode.InvalidRefreshToken);

  const result = await db.query(queryUserRefreshAccessToken(userId));
  // Invalid refresh token data
  if (!result.rowCount) return new ApolloError('', AuthenticationErrorCode.InvalidRefreshToken);

  const row = result.rows[0];

  if (!row.access_key) return new ApolloError('', AuthenticationErrorCode.BlockedUser);

  const REFRESH_JWT_SECRET = `${environment.REFRESH_TOKEN_SECRET}${row.access_key}`;

  try {
    verify(refreshToken, REFRESH_JWT_SECRET, {algorithms: [JWT_ALGORITHM]});
  } catch {
    // Token is forged or expired
    return new ApolloError('', AuthenticationErrorCode.InvalidRefreshToken);
  }

  // Token is valid; issue fresh access token
  const accessToken = sign({userId, language: row.language}, environment.ACCESS_TOKEN_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: environment.ACCESS_TOKEN_EXPIRES_IN,
  });

  return {accessToken, thumbnail: row.thumbnail, username: row.username};
};

export const authenticationQueryResolvers = {
  Query: {
    signIn,
    refreshAccessToken,
  },
};
