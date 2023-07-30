import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {
  AcceptFollowRequestMutationResult,
  DeclineFollowRequestMutationResult,
  FollowUserMutationResult,
  UnfollowUserMutationResult,
} from '~app/typings/follow/follow.interfaces';
import {
  ACCEPT_FOLLOW_REQUEST,
  DECLINE_FOLLOW_REQUEST,
  FOLLOW_USER,
  UNFOLLOW_USER,
} from '~app/graphql/follower/follower.mutations';

@Injectable({
  providedIn: 'root',
})
export class FollowerService {
  public constructor(private readonly apollo: Apollo) {}

  public followUser(userId: string): Observable<MutationResult<FollowUserMutationResult>> {
    return this.apollo.mutate<FollowUserMutationResult>({
      mutation: FOLLOW_USER,
      variables: {userId},
    });
  }

  public unfollowUser(userId: string): Observable<MutationResult<UnfollowUserMutationResult>> {
    return this.apollo.mutate<UnfollowUserMutationResult>({
      mutation: UNFOLLOW_USER,
      variables: {userId},
    });
  }

  public acceptFollowRequest(recordId: string): Observable<MutationResult<AcceptFollowRequestMutationResult>> {
    return this.apollo.mutate<AcceptFollowRequestMutationResult>({
      mutation: ACCEPT_FOLLOW_REQUEST,
      variables: {recordId},
    });
  }

  public declineFollowRequest(recordId: string): Observable<MutationResult<DeclineFollowRequestMutationResult>> {
    return this.apollo.mutate<DeclineFollowRequestMutationResult>({
      mutation: DECLINE_FOLLOW_REQUEST,
      variables: {recordId},
    });
  }
}
