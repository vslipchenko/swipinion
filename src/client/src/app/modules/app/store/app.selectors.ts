import {createSelector} from '@ngxs/store';
import {AppState, AppStateModel} from '~app/modules/app/store/app.state';
import {UIUserConversationMessage} from '~app/typings/user-messages/user-messages.interfaces';
import {getConversationKey} from '~app/utilities/user-messages';

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
    return state.messages.messages;
  });

  public static canLoadMoreMessages = createSelector([AppState], (state: AppStateModel) => {
    return state.messages.canLoadMore;
  });

  public static unreadMessages = createSelector([AppState], (state: AppStateModel) => {
    return state.unreadMessages;
  });

  public static conversationMessages = (
    userId1: string,
    userId2: string,
  ): ((state: AppStateModel) => Array<UIUserConversationMessage>) => {
    return createSelector([AppState], (state: AppStateModel) => {
      const conversationKey = getConversationKey(state.conversations, userId1, userId2);

      return state.conversations[conversationKey].messages;
    });
  };

  public static conversationUnprocessedMessages = (
    userId1: string,
    userId2: string,
  ): ((state: AppStateModel) => Array<UIUserConversationMessage>) => {
    return createSelector([AppState], (state: AppStateModel) => {
      const conversationKey = getConversationKey(state.conversations, userId1, userId2);

      return state.conversations[conversationKey].unprocessedMessages;
    });
  };

  public static canLoadMoreConversationMessages = (
    userId1: string,
    userId2: string,
  ): ((state: AppStateModel) => boolean) => {
    return createSelector([AppState], (state: AppStateModel) => {
      const conversationKey = getConversationKey(state.conversations, userId1, userId2);

      return state.conversations[conversationKey].canLoadMore;
    });
  };
}
