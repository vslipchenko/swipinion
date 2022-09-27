import {createSelector} from '@ngxs/store';
import {AppState, AppStateModel} from '~app/modules/app/store/app.state';
import {UIUserConversationMessage} from '~app/typings/user-messages/user-messages.interfaces';
import {compositeObjectKey} from '~app/utilities/data';

export class AppSelectors {
  public static userId = createSelector([AppState], (state: AppStateModel) => {
    return state.user.id;
  });

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

  public static conversationMessages = (
    userId1: string,
    userId2: string,
  ): ((state: AppStateModel) => Array<UIUserConversationMessage>) => {
    return createSelector([AppState], (state: AppStateModel) => {
      return (
        // It may be combination sender-recipient or recipient-sender
        state.conversations[compositeObjectKey(userId1, userId2)] ||
        state.conversations[compositeObjectKey(userId2, userId1)]
      );
    });
  };
}
