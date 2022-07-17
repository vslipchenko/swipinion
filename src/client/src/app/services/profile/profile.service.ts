import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {GET_PROFILE_DATA} from '~app/graphql/profile/profile.queries';
import {GetProfileDataQueryResult} from '~app/typings/profile/profile.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  public constructor(private readonly apollo: Apollo) {}

  public getProfileData(cacheFirst: boolean, username?: string): Observable<MutationResult<GetProfileDataQueryResult>> {
    return this.apollo.query<GetProfileDataQueryResult>({
      query: GET_PROFILE_DATA,
      variables: {username},
      fetchPolicy: cacheFirst ? 'cache-first' : 'no-cache',
    });
  }
}
