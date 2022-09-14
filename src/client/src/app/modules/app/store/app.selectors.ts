import {createSelector} from '@ngxs/store';
import {AppState, AppStateModel} from '~app/modules/app/store/app.state';

export class AppSelectors {
  public static userEssentials = createSelector([AppState], (state: AppStateModel) => {
    return state.user;
  });

  public static userRole = createSelector([AppState], (state: AppStateModel) => {
    return state.role;
  });

  public static utcTimestamp = createSelector([AppState], (state: AppStateModel) => {
    return state.utcTimestamp;
  });

  public static messages = createSelector([AppState], (state: AppStateModel) => {
    return state.messages;
  });

  public static unreadMessages = createSelector([AppState], (state: AppStateModel) => {
    return state.unreadMessages;
  });

  public static conversationMessages = createSelector([AppState], (state: AppStateModel) => {
    return state.conversationMessages;
  });
}
