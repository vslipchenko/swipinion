import {gql} from 'apollo-server-core';

export const authenticationTypes = gql`
  type SignInResult {
    accessToken: String
    refreshToken: String
    thumbnail: String
    username: String
    reason: Int
  }

  type RefreshAccessTokenResult {
    accessToken: String
    thumbnail: String
    username: String
  }
`;
