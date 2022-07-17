import {createSelector} from '@ngxs/store';
import {UserSettingsState, UserSettingsStateModel} from '~app/modules/user-settings/store/user-settings.state';
import {UserSettings} from '~app/typings/user-settings/user-settings.interfaces';

export class UserSettingsSelectors {
  public static settings = createSelector([UserSettingsState], (state: UserSettingsStateModel): UserSettings => {
    return state.settings;
  });
}
