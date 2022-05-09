import {gql} from 'apollo-angular';

export const SIGN_IN = gql`
  query ($input: SignIn!) {
    signIn(input: $input) {
      accessToken
      refreshToken
      thumbnail
      username
      reason
    }
  }
`;

export const REFRESH_ACCESS_TOKEN = gql`
  query ($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken) {
      accessToken
      thumbnail
      username
    }
  }
`;
