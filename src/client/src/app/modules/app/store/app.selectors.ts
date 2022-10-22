import {createSelector} from '@ngxs/store';
import {AppState, AppStateModel} from '~app/modules/app/store/app.state';
import {UIUserConversationMessage} from '~app/typings/user-messages/user-messages.interfaces';
import {getConversationKey} from '~app/utilities/user-messages';
import {UserStatus} from '~app/typings/user-status/user-status.interfaces';

export class AppSelectors {
  public static userStatus = createSelector([AppState], (state: AppStateModel): UserStatus => {
    return {
      hasUnreadMessage: Boolean(state.unreadMessages.length),
      hasUnreadNotification: Boolean(state.unreadNotification),
    };
  });

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

  public static messagesInitialized = createSelector([AppState], (state: AppStateModel) => {
    return state.messages.initialized;
  });

  public static canLoadMoreMessages = createSelector([AppState], (state: AppStateModel) => {
    return state.messages.canLoadMore;
  });

  public static unreadMessages = createSelector([AppState], (state: AppStateModel) => {
    return state.unreadMessages;
  });

  public static savedMessage = createSelector([AppState], (state: AppStateModel) => {
    return state.savedMessages.message;
  });

  public static savedMessages = createSelector([AppState], (state: AppStateModel) => {
    return state.savedMessages.messages;
  });

  public static savedMessagesInitialized = createSelector([AppState], (state: AppStateModel) => {
    return state.savedMessages.initialized;
  });

  public static canLoadMoreSavedMessages = createSelector([AppState], (state: AppStateModel) => {
    return state.savedMessages.canLoadMore;
  });

  public static activeConversation = createSelector([AppState], (state: AppStateModel) => {
    return state.activeConversation;
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

  public static conversationMessagesInitialized = (
    userId1: string,
    userId2: string,
  ): ((state: AppStateModel) => boolean) => {
    return createSelector([AppState], (state: AppStateModel) => {
      const conversationKey = getConversationKey(state.conversations, userId1, userId2);

      return state.conversations[conversationKey].initialized;
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
