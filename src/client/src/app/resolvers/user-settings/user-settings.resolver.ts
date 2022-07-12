import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {GetUserSettingsQueryResult} from '~app/typings/user-settings/user-settings.interfaces';
import {ApolloQueryResult} from '@apollo/client/core';
import {FetchUserSettings} from '~app/modules/user/store/user.actions';
import {Store} from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsResolver implements Resolve<ApolloQueryResult<GetUserSettingsQueryResult>> {
  public constructor(private readonly store: Store) {}

  public resolve(): Observable<ApolloQueryResult<GetUserSettingsQueryResult>> {
    return this.store.dispatch(new FetchUserSettings());
  }
}
