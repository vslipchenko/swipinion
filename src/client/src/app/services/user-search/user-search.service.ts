import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {SEARCH_USER} from '~app/graphql/user-search/user-search.queries';
import {UserEssentials} from '~app/typings/user-search/user-search.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserSearchService {
  public constructor(private readonly apollo: Apollo) {}

  public searchUser(username: string): Observable<ApolloQueryResult<UserEssentials>> {
    return this.apollo.query<UserEssentials>({
      query: SEARCH_USER,
      variables: {username},
      fetchPolicy: 'no-cache',
    });
  }
}
