import {gql} from 'apollo-angular';

export const FOLLOW_USER = gql`
  mutation ($userId: String!) {
    followUser(userId: $userId) {
      success
    }
  }
`;
