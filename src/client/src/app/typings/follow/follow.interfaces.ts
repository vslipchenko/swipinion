import {SuccessResponse} from '~app/typings/response/response.interfaces';

export interface FollowUserMutationResult {
  followUser: {pending: boolean};
}

export interface UnfollowUserMutationResult {
  unfollowUser: SuccessResponse;
}

export interface AcceptFollowRequestMutationResult {
  acceptFollowRequest: SuccessResponse;
}

export interface DeclineFollowRequestMutationResult {
  declineFollowRequest: SuccessResponse;
}
