import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {GetUserSettingsQueryResult, UserSettings} from '~app/typings/user-settings/user-settings.interfaces';
import {FollowSettings, PrivacyCommonSettings} from '~app/typings/user-settings/user-settings.enums';
import {map, Observable, tap, throwError} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {FetchProfileSettings, UpdateProfileSettings} from '~app/modules/user-settings/store/user-settings.actions';
import {UserSettingsService} from '~app/services/user-settings/user-settings.service';

export interface UserSettingsStateModel {
  settings: UserSettings;
}

const USER_SETTINGS_STATE = new StateToken<UserSettingsStateModel>('userSettings');

@State({
  name: USER_SETTINGS_STATE,
  defaults: {
    settings: {
      follow: FollowSettings.Everyone,
      view_following: PrivacyCommonSettings.Everyone,
      message: PrivacyCommonSettings.Everyone,
      view_opinions: PrivacyCommonSettings.Everyone,
      view_reactions: PrivacyCommonSettings.Everyone,
      view_favorites: PrivacyCommonSettings.Everyone,
    },
  },
})
@Injectable()
export class UserSettingsState {
  public constructor(private readonly userSettingsService: UserSettingsService) {}

  @Action(FetchProfileSettings)
  private fetchProfileSettings(
    context: StateContext<UserSettingsStateModel>,
  ): Observable<ApolloQueryResult<GetUserSettingsQueryResult>> {
    return this.userSettingsService.getUserSettings().pipe(
      tap(({data}) => {
        if (!data.userSettings) return;

        context.setState((state) => ({
          ...state,
          settings: {
            ...state.settings,
            ...data.userSettings,
          },
        }));
      }),
    );
  }

  @Action(UpdateProfileSettings)
  private updateProfileSettings(
    context: StateContext<UserSettingsStateModel>,
    action: UpdateProfileSettings,
  ): Observable<unknown> {
    return this.userSettingsService.updateUserSettings(action.payload).pipe(
      map((result) => {
        if (!result.data?.updateUserSettings?.success) return throwError('');

        context.setState((state) => ({
          ...state,
          settings: {
            ...state.settings,
            ...action.payload,
          },
        }));

        return result;
      }),
    );
  }
}
