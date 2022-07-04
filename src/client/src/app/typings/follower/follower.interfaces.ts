import {SuccessResponse} from '~app/typings/response/response.interfaces';

export interface FollowUserMutationResult {
  followUser: SuccessResponse;
}

export interface UnfollowUserMutationResult {
  unfollowUser: SuccessResponse;
}
