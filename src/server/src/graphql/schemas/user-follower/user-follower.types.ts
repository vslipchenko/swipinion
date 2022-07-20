import {gql} from 'apollo-server-core';

export const userFollowerTypes = gql`
  type FollowingPendingStatus {
    pending: Boolean
  }
`;
