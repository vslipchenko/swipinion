import {Action, State, StateContext, StateToken, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
  FetchNewUserMessages,
  FetchUserConversation,
  FetchUserMessages,
  RunUserStatusPolling,
  UpdateUserEssentials,
  UpdateUserRole,
  UpdateUtcTimestamp,
} from '~app/modules/app/store/app.actions';
import {UserEssentials} from '~app/typings/user/user.interfaces';
import {UserRole} from '~app/typings/user/user.enums';
import {UserStatusService} from '~app/services/user-status/user-status.service';
import {Observable, tap} from 'rxjs';
import {UserMessagesService} from '~app/services/user-messages/user-messages.service';
import {
  UIUserConversationMessage,
  UIUserMessage,
  UnreadMessage,
} from '~app/typings/user-messages/user-messages.interfaces';
import {
  actualizeConversationMessagesDate,
  actualizeUnreadMessages,
  convertToUiMessages,
  getInterlocutorId,
  markMessageRead,
} from '~app/utilities/user-messages';
import {compositeObjectKey} from '~app/utilities/data';

export interface AppStateModel {
  user: UserEssentials;
  messages: Array<UIUserMessage>;
  conversations: {[key: string]: Array<UIUserConversationMessage>};
  role: UserRole;
  utcTimestamp: number;
  unreadMessages: Array<UnreadMessage>;
  unreadNotification: string;
}

const APP_STATE = new StateToken<AppStateModel>('app');

@State({
  name: APP_STATE,
  defaults: {
    user: {
      id: '',
      username: '',
      thumbnail: '',
      language: 'en',
    },
    messages: [],
    conversations: {},
    role: UserRole.Guest,
    unreadMessages: [],
    unreadNotification: '',
    utcTimestamp: new Date().getTime(),
  },
})
@Injectable()
export class AppState {
  public constructor(
    private readonly store: Store,
    private readonly userStatusService: UserStatusService,
    private readonly userMessagesService: UserMessagesService,
  ) {}

  @Action(UpdateUserEssentials)
  private updateUserEssentials(context: StateContext<AppStateModel>, action: UpdateUserEssentials): void {
    context.setState((state) => ({
      ...state,
      user: {
        ...state.user,
        ...action.payload,
      },
    }));
  }

  @Action(UpdateUserRole)
  private updateUserRole(context: StateContext<AppStateModel>, action: UpdateUserRole): void {
    context.setState((state) => ({
      ...state,
      role: action.payload,
    }));
  }

  @Action(UpdateUtcTimestamp)
  private updateUtcTimestamp(context: StateContext<AppStateModel>, action: UpdateUtcTimestamp): void {
    context.setState((state) => ({
      ...state,
      utcTimestamp: action.payload,
    }));
  }

  @Action(RunUserStatusPolling)
  private runUserStatusPolling(
    context: StateContext<AppStateModel>,
    action: RunUserStatusPolling,
  ): Observable<unknown> {
    return this.userStatusService.checkUserStatus(action.payload).pipe(
      tap(({data}) => {
        if (!data.checkUserStatus) return;

        context.setState((state) => {
          const nextState = {
            ...state,
            ...data.checkUserStatus,
          };

          const recentMessageId = Number(state.messages[0]?.id);

          const fetchNewMessages =
            state.messages.length &&
            data.checkUserStatus.unreadMessages.length &&
            data.checkUserStatus.unreadMessages.some((message) => Number(message.id) > recentMessageId);

          if (fetchNewMessages) {
            const fetchMessages: Array<string> = [];

            data.checkUserStatus.unreadMessages.forEach((message) => {
              if (Number(message.id) > recentMessageId) fetchMessages.push(message.id);
            });

            if (fetchMessages.length) context.dispatch(new FetchNewUserMessages(fetchMessages));
          }

          return nextState;
        });
      }),
    );
  }

  @Action(FetchUserMessages)
  private fetchUserMessages(context: StateContext<AppStateModel>, action: FetchUserMessages): Observable<unknown> {
    return this.userMessagesService.fetchUserMessages(action.payload).pipe(
      tap(({data}) => {
        if (!data.fetchUserMessages) return;

        context.setState((state) => ({
          ...state,
          messages: [...state.messages, ...convertToUiMessages(data.fetchUserMessages, state.user.id)],
        }));
      }),
    );
  }

  @Action(FetchNewUserMessages)
  private fetchNewUserMessages(
    context: StateContext<AppStateModel>,
    action: FetchNewUserMessages,
  ): Observable<unknown> {
    return this.userMessagesService.fetchNewUserMessages(action.payload).pipe(
      tap(({data}) => {
        if (!data.fetchNewUserMessages) return;

        context.setState((state) => {
          const messages = convertToUiMessages(data.fetchNewUserMessages, state.user.id);

          let nextMessages = state.messages.filter(
            // This will allow to bubble up existing conversations thus avoiding duplicates
            (message) => {
              const interlocutorId = getInterlocutorId(message.sender_id, message.recipient_id, state.user.id);

              const hasNewMessage = messages.some(
                (item) => item.sender_id === interlocutorId || item.recipient_id === interlocutorId,
              );

              return !hasNewMessage;
            },
          );

          nextMessages = [...messages, ...nextMessages];

          return {
            ...state,
            messages: nextMessages,
          };
        });
      }),
    );
  }

  @Action(FetchUserConversation)
  private fetchUserConversation(
    context: StateContext<AppStateModel>,
    action: FetchUserConversation,
  ): Observable<unknown> {
    return this.userMessagesService.fetchUserConversation(action.payload).pipe(
      tap(({data}) => {
        if (!data.fetchUserConversation) return;

        const conversationKey = compositeObjectKey(action.payload.user_id_1, action.payload.user_id_2);

        context.setState((state) => {
          let nextConversation = data.fetchUserConversation;
          let unreadMessages: Array<UnreadMessage> = [];
          let messages: Array<UIUserMessage> = [];

          if (action.payload.edgeId) {
            // Fetched messages for initialized conversation
            // Because of the descendant (reverse) order new messages get prepended
            if (action.payload.fetchNew) {
              nextConversation = actualizeConversationMessagesDate([
                ...nextConversation,
                ...state.conversations[conversationKey],
              ]);
            } else {
              nextConversation = actualizeConversationMessagesDate([
                ...state.conversations[conversationKey],
                ...nextConversation,
              ]);
            }
          }

          if (action.payload.markRead) {
            // Fetched / initialized conversation messages
            const interlocutorId = getInterlocutorId(action.payload.user_id_1, action.payload.user_id_2, state.user.id);

            unreadMessages = actualizeUnreadMessages(state.unreadMessages, interlocutorId);

            messages = markMessageRead(state.messages, interlocutorId);
          }

          const nextState = {
            ...state,
            conversations: {
              ...state.conversations,
              [conversationKey]: actualizeConversationMessagesDate(nextConversation),
            },
          };

          if (unreadMessages.length) nextState.unreadMessages = unreadMessages;

          if (messages.length) nextState.messages = messages;

          return nextState;
        });
      }),
    );
  }
}
