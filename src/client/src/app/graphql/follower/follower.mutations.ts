import {gql} from 'apollo-angular';

export const FOLLOW_USER = gql`
  mutation ($username: String!) {
    followUser(username: $username) {
      success
    }
  }
`;
