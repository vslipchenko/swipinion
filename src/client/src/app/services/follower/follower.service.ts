import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {FollowUserMutationResult} from '~app/typings/follower/follower.interfaces';
import {FOLLOW_USER} from '~app/graphql/follower/follower.mutations';

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
}
