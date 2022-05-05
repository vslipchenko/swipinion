import {gql} from 'apollo-server-core';

export const authenticationTypes = gql`
  type SignInResult {
    accessToken: String
    refreshToken: String
    reason: Int
  }
`;
