import {Action, State, StateContext, StateToken, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
  FetchNewUserMessages,
  FetchUserConversation,
  FetchUserMessages,
  FetchUserSavedMessages,
  RunConversationMessageStatusCheck,
  RunUserStatusPolling,
  SendUserMessage,
  SendUserSavedMessage,
  SetActiveConversation,
  UpdateUserEssentials,
  UpdateUserRole,
  UpdateUtcTimestamp,
  UserStatusUpdatedBeforeMessagesInitialFetch,
} from '~app/modules/app/store/app.actions';
import {UserEssentials} from '~app/typings/user/user.interfaces';
import {UserRole} from '~app/typings/user/user.enums';
import {UserStatusService} from '~app/services/user-status/user-status.service';
import {Observable, tap} from 'rxjs';
import {UserMessagesService} from '~app/services/user-messages/user-messages.service';
import {
  ActiveConversation,
  Conversations,
  SavedMessages,
  UIUserMessage,
  UnreadMessage,
} from '~app/typings/user-messages/user-messages.interfaces';
import {
  actualizeConversationMessagesDateTiles,
  actualizeConversationMessagesReadStatus,
  actualizeUnreadMessages,
  convertBodyToTeaser,
  convertToUiMessage,
  convertToUiMessages,
  defineConversationMessagesTime,
  defineConversationMessageTime,
  excludeNewMessages,
  getConversationKey,
  getInterlocutorId,
  markMessagesRead,
} from '~app/utilities/user-messages';
import {
  USER_CONVERSATION_MESSAGES_FETCH_LIMIT,
  USER_MESSAGES_FETCH_LIMIT,
  USER_SAVED_MESSAGES_FETCH_LIMIT,
} from '~app/constants/user-messages';
import {Messages} from '~app/typings/user-messages/user-messages.types';

export interface AppStateModel {
  user: UserEssentials;
  savedMessages: SavedMessages; // TODO flatten state shape
  messages: Messages; // TODO flatten state shape
  conversations: Conversations;
  conversation: ActiveConversation | null;
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
    savedMessages: {
      message: {
        id: '',
        username: '',
        thumbnail: '',
        sender_id: '',
        recipient_id: '',
        teaser: '',
        read: true,
        created_at: 0,
        date: '',
        unread: false,
      },
      messages: [],
      canLoadMore: false,
      initialized: false,
    },
    messages: {
      messages: [],
      canLoadMore: false,
      initialized: false,
    },
    conversations: {},
    conversation: null,
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
    return this.userStatusService.checkUserStatus(action.payload.checkMessage).pipe(
      tap(({data}) => {
        if (!data.checkUserStatus) return;

        if (action.payload.dispatchActionAfterStatusChecked)
          this.store.dispatch(new UserStatusUpdatedBeforeMessagesInitialFetch());

        context.setState((state) => {
          const nextState = {
            ...state,
          };

          if (action.payload.checkMessage) {
            nextState.unreadMessages = data.checkUserStatus.unreadMessages;

            const recentMessageId = Number(state.messages.messages[0]?.id);

            const fetchNewMessages =
              state.messages.messages.length &&
              data.checkUserStatus.unreadMessages.length &&
              data.checkUserStatus.unreadMessages.some((message) => Number(message.id) > recentMessageId);

            if (fetchNewMessages) {
              const fetchMessages: Array<string> = [];

              data.checkUserStatus.unreadMessages.forEach((message) => {
                if (Number(message.id) > recentMessageId) fetchMessages.push(message.id);
              });

              if (fetchMessages.length) context.dispatch(new FetchNewUserMessages(fetchMessages));
            }
          }

          // if (action.payload.checkNotification)
          nextState.unreadNotification = data.checkUserStatus.unreadNotification;

          return nextState;
        });
      }),
    );
  }

  @Action(FetchUserMessages) // Fetch saved messages as well as messages from other users
  private fetchUserMessages(context: StateContext<AppStateModel>, action: FetchUserMessages): Observable<unknown> {
    return this.userMessagesService.fetchUserMessages(action.payload).pipe(
      tap(({data}) => {
        // Expected response value is one of: [] | [saved_message] | [...messages] | [...messages, saved_message]
        if (!data.fetchUserMessages || (!data.fetchUserMessages.length && action.payload)) return;

        context.setState((state) => {
          const nextState = {
            ...state,
            messages: action.payload ? state.messages : {...state.messages, messages: []},
          };

          if (!action.payload) {
            nextState.messages.initialized = true;

            if (!data.fetchUserMessages.length) return nextState;

            const savedMessage = data.fetchUserMessages.find((message) => !message.sender_id); // * Saved messages does not have sender_id nor recipient_id values

            if (savedMessage) {
              nextState.savedMessages = {
                ...nextState.savedMessages,
                message: convertToUiMessage(savedMessage),
              };

              if (data.fetchUserMessages.length === 1)
                // Response value is [saved_message]
                return nextState;

              // Response value is [...messages, saved_message]
              data.fetchUserMessages.pop(); // Remove saved message
            }
          }
          // Response value is [...messages]
          nextState.messages = {
            ...nextState.messages,
            messages: [...nextState.messages.messages, ...convertToUiMessages(data.fetchUserMessages, state.user.id)],
            canLoadMore: data.fetchUserMessages.length === USER_MESSAGES_FETCH_LIMIT,
          };

          return nextState;
        });
      }),
    );
  }

  @Action(FetchNewUserMessages) // Reason for why we cant simply extend FetchUserMessages's action logic: we can't rely on state.messages[0].id as it can be out of sync, therefore array of unread message id's is used as a payload
  private fetchNewUserMessages(
    context: StateContext<AppStateModel>,
    action: FetchNewUserMessages,
  ): Observable<unknown> {
    return this.userMessagesService.fetchNewUserMessages(action.payload).pipe(
      tap(({data}) => {
        if (!data.fetchNewUserMessages) return;

        context.setState((state) => {
          const messages = convertToUiMessages(data.fetchNewUserMessages, state.user.id);

          return {
            ...state,
            messages: {
              ...state.messages,
              messages: [...messages, ...excludeNewMessages(state.user.id, state.messages.messages, messages)], // Bubble up (new / updated existing) conversations,
            },
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
        if (!data.fetchUserConversation?.length) return; // Expected value: null | [] | [...conversation_messages]

        context.setState((state) => {
          const conversationKey = getConversationKey(
            state.conversations,
            action.payload.user_id_1,
            action.payload.user_id_2,
          );

          let nextConversation = defineConversationMessagesTime(data.fetchUserConversation);
          let messages: Array<UIUserMessage> = [];

          if (action.payload.edgeId) {
            // Fetched messages for initialized conversation
            // Because of the descendant (reverse) order new messages get prepended
            if (action.payload.fetchNew) {
              nextConversation = [
                ...nextConversation,
                ...actualizeConversationMessagesReadStatus(
                  state.conversations[conversationKey].messages,
                  state.conversations[conversationKey].messages[0].id,
                  state.user.id,
                ),
              ];
            } else {
              nextConversation = [...state.conversations[conversationKey].messages, ...nextConversation];
            }
          }

          const nextState = {
            ...state,
            conversations: {
              ...state.conversations,
              [conversationKey]: {
                ...state.conversations[conversationKey],
                messages: actualizeConversationMessagesDateTiles(nextConversation),
                initialized: true,
              },
            },
          };

          if (action.payload.markRead) {
            const interlocutorId = getInterlocutorId(action.payload.user_id_1, action.payload.user_id_2, state.user.id);

            nextState.unreadMessages = actualizeUnreadMessages(state.unreadMessages, interlocutorId);

            messages = markMessagesRead(state.messages.messages, interlocutorId);
          }

          if (!action.payload.fetchNew)
            // Avoid canLoadMore value rewrite on a new message fetch
            nextState.conversations[conversationKey].canLoadMore =
              data.fetchUserConversation.length === USER_CONVERSATION_MESSAGES_FETCH_LIMIT;

          if (messages.length)
            nextState.messages = {
              ...state.messages,
              messages,
            };

          return nextState;
        });
      }),
    );
  }

  @Action(RunConversationMessageStatusCheck)
  private runConversationMessageStatusCheck(
    context: StateContext<AppStateModel>,
    action: RunConversationMessageStatusCheck,
  ): Observable<unknown> {
    return this.userMessagesService.checkConversationMessageStatus(action.payload).pipe(
      tap(({data}) => {
        if (!data.checkConversationMessageStatus) return;

        context.setState((state) => {
          const conversationKey = getConversationKey(state.conversations, action.payload, state.user.id);
          const lastReadMessageId = data.checkConversationMessageStatus;

          if (state.conversations[conversationKey].messages[0].id === lastReadMessageId) return state; // Nothing has changed; May be improved with id condition in the query

          return {
            ...state,
            conversations: {
              ...state.conversations,
              [conversationKey]: {
                ...state.conversations[conversationKey],
                messages: actualizeConversationMessagesReadStatus(
                  state.conversations[conversationKey].messages,
                  lastReadMessageId,
                  state.user.id,
                ),
              },
            },
          };
        });
      }),
    );
  }

  @Action(SendUserMessage)
  private sendUserMessage(context: StateContext<AppStateModel>, action: SendUserMessage): Observable<unknown> {
    return this.userMessagesService
      .sendMessage({
        edgeId: action.payload.edgeId,
        body: action.payload.body,
        recipientId: action.payload.recipientId,
      })
      .pipe(
        tap(({data}) => {
          if (!data?.sendUserMessage?.success) return; // TODO implement proper failed message send handling involving snackbar and updating state correspondingly

          context.setState((state) => {
            const sentMessageBody = action.payload.body.trim();
            const conversationKey = getConversationKey(state.conversations, action.payload.recipientId, state.user.id);
            const sentMessageFragment = {
              ...data.sendUserMessage.results.sentMessage,
              sender_id: state.user.id,
              recipient_id: action.payload.recipientId,
              read: false,
            };

            const sentMessage = convertToUiMessage(
              {
                ...sentMessageFragment,
                username: action.payload.username,
                thumbnail: action.payload.thumbnail,
                teaser: convertBodyToTeaser(sentMessageBody),
              },
              state.user.id,
            );

            const interlocutorMessages = data.sendUserMessage.results.interlocutorMessages.map((message) => ({
              ...message,
              sender_id: action.payload.recipientId,
              recipient_id: state.user.id,
              read: true,
            }));

            const newMessages = defineConversationMessagesTime([
              {
                ...sentMessageFragment,
                body: sentMessageBody,
              },
              ...interlocutorMessages,
            ]);

            return {
              ...state,
              messages: {
                ...state.messages,
                messages: [sentMessage, ...excludeNewMessages(state.user.id, state.messages.messages, [sentMessage])],
              },
              conversations: {
                ...state.conversations,
                [conversationKey]: state.conversations[conversationKey]
                  ? {
                      ...state.conversations[conversationKey],
                      messages: actualizeConversationMessagesDateTiles([
                        ...newMessages,
                        ...(interlocutorMessages.length
                          ? actualizeConversationMessagesReadStatus(
                              state.conversations[conversationKey].messages,
                              state.conversations[conversationKey].messages[0].id,
                              state.user.id,
                            )
                          : state.conversations[conversationKey].messages),
                      ]),
                    }
                  : {
                      // Initialized conversation: in case if message was sent via dialog and conversation has not being initialized
                      messages: [],
                      canLoadMore: false,
                      initialized: false,
                    },
              },
            };
          });
        }),
      );
  }

  @Action(SendUserSavedMessage)
  private sendUserSavedMessage(
    context: StateContext<AppStateModel>,
    action: SendUserSavedMessage,
  ): Observable<unknown> {
    return this.userMessagesService.sendSavedMessage(action.payload).pipe(
      tap(({data}) => {
        if (!data?.sendUserSavedMessage) return;

        const trimmedBody = action.payload.trim();

        context.setState((state) => {
          const savedMessage = {
            ...data.sendUserSavedMessage,
            sender_id: '',
            recipient_id: '',
            username: '',
            thumbnail: '',
            body: trimmedBody,
            teaser: convertBodyToTeaser(trimmedBody),
            read: false,
          };

          return {
            ...state,
            savedMessages: {
              ...state.savedMessages, //convertBodyToTeaser
              message: convertToUiMessage(savedMessage),
              messages: actualizeConversationMessagesDateTiles([
                defineConversationMessageTime(savedMessage),
                ...state.savedMessages.messages,
              ]),
            },
          };
        });
      }),
    );
  }

  @Action(FetchUserSavedMessages)
  private fetchUserSavedMessages(
    context: StateContext<AppStateModel>,
    action: FetchUserSavedMessages,
  ): Observable<unknown> {
    return this.userMessagesService.fetchUserSavedMessages(action.payload).pipe(
      tap(({data}) => {
        if (!data.fetchUserSavedMessages) return;

        context.setState((state) => {
          const messages = defineConversationMessagesTime(data.fetchUserSavedMessages);

          return {
            ...state,
            savedMessages: {
              ...state.savedMessages,
              messages: actualizeConversationMessagesDateTiles(
                action.payload
                  ? [...state.savedMessages.messages, ...messages] // Fetched old messages
                  : [...messages], // Initial fetch
              ),
              canLoadMore: data.fetchUserSavedMessages.length === USER_SAVED_MESSAGES_FETCH_LIMIT,
              initialized: true,
            },
          };
        });
      }),
    );
  }

  @Action(SetActiveConversation)
  private setActiveConversation(context: StateContext<AppStateModel>, action: SetActiveConversation): void {
    context.setState((state) => {
      return {
        ...state,
        conversation: action.payload,
      };
    });
  }
}
