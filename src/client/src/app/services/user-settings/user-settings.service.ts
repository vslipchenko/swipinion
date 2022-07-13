import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {GET_USER_SETTINGS} from '~app/graphql/user-settings/user-settings.queries';
import {
  GetUserSettingsQueryResult,
  UpdateUserSettingsMutationResult,
  UserSettings,
} from '~app/typings/user-settings/user-settings.interfaces';
import {UPDATE_USER_SETTINGS} from '~app/graphql/user-settings/user-settings.mutations';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  public constructor(private readonly apollo: Apollo) {}

  public updateUserSettings(input: UserSettings): Observable<MutationResult<UpdateUserSettingsMutationResult>> {
    return this.apollo.mutate<UpdateUserSettingsMutationResult>({
      mutation: UPDATE_USER_SETTINGS,
      variables: {input},
    });
  }

  public getUserSettings(): Observable<ApolloQueryResult<GetUserSettingsQueryResult>> {
    return this.apollo.query<GetUserSettingsQueryResult>({
      query: GET_USER_SETTINGS,
    });
  }
}
