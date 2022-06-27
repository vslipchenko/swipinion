import {createSelector} from '@ngxs/store';
import {AppState, AppStateModel} from '~app/modules/app/store/app.state';

export class AppSelectors {
  public static userProfile = createSelector([AppState], (state: AppStateModel) => {
    return state.profile;
  });

  public static userRole = createSelector([AppState], (state: AppStateModel) => {
    return state.role;
  });
}
