import {gql} from 'apollo-angular';

export const FOLLOW_USER = gql`
  mutation ($userId: String!) {
    followUser(userId: $userId) {
      pending
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation ($userId: String!) {
    unfollowUser(userId: $userId) {
      success
    }
  }
`;
