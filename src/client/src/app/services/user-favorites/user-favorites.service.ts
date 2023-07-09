import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {GET_FAVORITES_BY_USER_ID} from '~app/graphql/user-favorites/user-favorites.queries';
import {GetUserFavorites, GetUserFavoritesQueryResult} from '~app/typings/user-favorites/user-favorites.intefaces';

@Injectable({
  providedIn: 'root',
})
export class UserFavoritesService {
  public constructor(private readonly apollo: Apollo) {}

  public getUserFavorites(input: GetUserFavorites): Observable<ApolloQueryResult<GetUserFavoritesQueryResult>> {
    return this.apollo.query<GetUserFavoritesQueryResult>({
      query: GET_FAVORITES_BY_USER_ID,
      variables: {input},
      fetchPolicy: 'no-cache',
    });
  }
}
