import {gql} from 'apollo-server-core';

export const followerTypes = gql`
  type FollowingPendingStatus {
    pending: Boolean
  }
`;
