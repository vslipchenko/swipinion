import {createSelector} from '@ngxs/store';
import {AppState, AppStateModel} from '~app/modules/app/store/app.state';

export class AppSelectors {
  public static authedUserProfileTeaser = createSelector([AppState], (state: AppStateModel) => {
    return state.profileTeaser;
  });

  public static userRole = createSelector([AppState], (state: AppStateModel) => {
    return state.role;
  });
}
