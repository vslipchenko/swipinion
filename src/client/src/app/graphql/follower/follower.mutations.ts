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

export const ACCEPT_FOLLOW_REQUEST = gql`
  mutation ($recordId: String!) {
    acceptFollowRequest(recordId: $recordId) {
      success
    }
  }
`;

export const DECLINE_FOLLOW_REQUEST = gql`
  mutation ($recordId: String!) {
    declineFollowRequest(recordId: $recordId) {
      success
    }
  }
`;
