import {SuccessResponse} from '~app/typings/response/response.interfaces';

export interface FollowUserMutationResult {
  followUser: {pending: boolean};
}

export interface UnfollowUserMutationResult {
  unfollowUser: SuccessResponse;
}
