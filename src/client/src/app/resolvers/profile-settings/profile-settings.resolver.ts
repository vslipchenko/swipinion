import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {GetUserSettingsQueryResult} from '~app/typings/user-settings/user-settings.interfaces';
import {ApolloQueryResult} from '@apollo/client/core';
import {Store} from '@ngxs/store';
import {FetchProfileSettings} from '~app/modules/user-settings/store/user-settings.actions';

@Injectable({
  providedIn: 'root',
})
export class ProfileSettingsResolver implements Resolve<ApolloQueryResult<GetUserSettingsQueryResult>> {
  public constructor(private readonly store: Store) {}

  public resolve(): Observable<ApolloQueryResult<GetUserSettingsQueryResult>> {
    return this.store.dispatch(new FetchProfileSettings());
  }
}
