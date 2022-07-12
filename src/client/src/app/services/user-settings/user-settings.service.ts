import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {GET_USER_SETTINGS} from '~app/graphql/user-settings/user-settings.queries';
import {GetUserSettingsQueryResult} from '~app/typings/user-settings/user-settings.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  public constructor(private readonly apollo: Apollo) {}

  public getUserSettings(): Observable<ApolloQueryResult<GetUserSettingsQueryResult>> {
    return this.apollo.query<GetUserSettingsQueryResult>({
      query: GET_USER_SETTINGS,
    });
  }
}
