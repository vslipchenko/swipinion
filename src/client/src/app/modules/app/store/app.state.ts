import {Action, State, StateContext, StateToken, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
  AddOpinionToFavorites,
  FetchNewUserMessages,
  FetchUserConversation,
  FetchUserMessages,
  FetchUserSavedMessages,
  RunConversationMessageStatusCheck,
  RunUserStatusPolling,
  SendUserMessage,
  SendUserSavedMessage,
  SetActiveConversation,
  SetUnreadNotification,
  UpdateUserEssentials,
  UpdateUserRole,
  UpdateUtcTimestamp,
  UserStatusUpdatedBeforeMessagesInitialFetch,
} from '~app/modules/app/store/app.actions';
import {AuthenticatedUserEssentials} from '~app/typings/user/user.interfaces';
import {UserRole} from '~app/typings/user/user.enums';
import {UserStatusService} from '~app/services/user-status/user-status.service';
import {Observable, tap} from 'rxjs';
import {UserMessagesService} from '~app/services/user-messages/user-messages.service';
import {
  ActiveConversation,
  Conversations,
  SavedMessages,
  UnreadMessage,
  UserMessage,
} from '~app/typings/user-messages/user-messages.interfaces';
import {
  actualizeConversationMessagesDateTiles,
  actualizeConversationMessagesReadStatus,
  actualizeUnreadMessages,
  convertBodyToTeaser,
  convertToUiMessage,
  convertToUiMessages,
  defineConversationKey,
  defineConversationMessagesTime,
  defineConversationMessageTime,
  excludeNewMessages,
  getInterlocutorId,
  markMessagesRead,
} from '~app/utilities/user-messages';
import {
  USER_CONVERSATION_MESSAGES_FETCH_LIMIT,
  USER_MESSAGES_FETCH_LIMIT,
  USER_SAVED_MESSAGES_FETCH_LIMIT,
} from '~app/constants/user-messages';
import {Messages} from '~app/typings/user-messages/user-messages.types';
import {ActiveConversationType} from '~app/typings/user-conversations/user-conversations.enums';
import {AddOpinionToFavoritesFailReason} from '~app/typings/opinion/opinion.enums';
import {OpinionsStateModel} from '~app/modules/opinions/store/opinions.state';
import {OpinionService} from '~app/services/opinion/opinion.service';

export interface AppStateModel {
  user: AuthenticatedUserEssentials;
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

// Global app state
/*
  TODO split app state into multiple global states so there will be:
  app state
  global user state
  global user messages state
  global user opinion state
 */
@State({
  name: APP_STATE,
  defaults: {
    user: {
      id: '',
      username: '',
      thumbnail: '',
      bio: '',
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
    private readonly opinionService: OpinionService,
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
    return this.userStatusService
      .checkUserStatus({
        checkMessage: action.payload.checkMessage,
        checkNotification: action.payload.checkNotification,
      })
      .pipe(
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
    const activeConversation = context.getState().conversation; // Capture snapshot in order to avoid possible null value due to async operation

    return this.userMessagesService.fetchUserConversation(action.payload).pipe(
      tap(({data}) => {
        if (!data.fetchUserConversation?.length) return; // Expected value: null | [] | [...conversation_messages]

        context.setState((state) => {
          const conversationKey = defineConversationKey(
            state.conversations,
            action.payload.user_id_1,
            action.payload.user_id_2,
          );

          let nextConversation = defineConversationMessagesTime(data.fetchUserConversation);

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

            nextState.messages = {
              ...state.messages,
              messages: markMessagesRead(state.messages.messages, interlocutorId),
            };

            if (!action.payload.fetchNew) {
              const conversationPreviewMessagePresent = nextState.messages.messages.some(
                (message) => message.sender_id === interlocutorId || message.recipient_id === interlocutorId,
              );
              // Sync new message with messages list
              if (!conversationPreviewMessagePresent) {
                const recentMessage: UserMessage = {
                  ...nextConversation[0],
                  username: activeConversation?.username as string,
                  thumbnail: activeConversation?.thumbnail as string,
                  teaser: convertBodyToTeaser(nextConversation[0].body),
                };

                nextState.messages.messages = [convertToUiMessage(recentMessage), ...nextState.messages.messages];
              }
            }
          }

          if (!action.payload.fetchNew)
            // Avoid canLoadMore value rewrite on a new message fetch
            nextState.conversations[conversationKey].canLoadMore =
              data.fetchUserConversation.length === USER_CONVERSATION_MESSAGES_FETCH_LIMIT;

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
          const conversationKey = defineConversationKey(state.conversations, action.payload, state.user.id);
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
            const conversationKey = defineConversationKey(
              state.conversations,
              action.payload.recipientId,
              state.user.id,
            );
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
          const nextState = {
            ...state,
            savedMessages: {
              ...state.savedMessages,
              initialized: true,
            },
          };

          if (!data.fetchUserSavedMessages.length) {
            nextState.savedMessages.canLoadMore = false;

            return nextState;
          }

          const messages = defineConversationMessagesTime(data.fetchUserSavedMessages);

          nextState.savedMessages.canLoadMore = messages.length === USER_SAVED_MESSAGES_FETCH_LIMIT;

          nextState.savedMessages.messages = actualizeConversationMessagesDateTiles(
            action.payload
              ? [...state.savedMessages.messages, ...messages] // Fetched old messages
              : [...messages], // Initial fetch
          );

          return nextState;
        });
      }),
    );
  }

  @Action(SetActiveConversation)
  private setActiveConversation(context: StateContext<AppStateModel>, action: SetActiveConversation): void {
    context.setState((state) => {
      const nextState = {
        ...state,
        conversation: action.payload,
      };

      if (action.payload?.type === ActiveConversationType.UserConversation) {
        const conversationKey = defineConversationKey(
          state.conversations,
          action.payload.userId1,
          action.payload.userId2,
        );

        if (!state.conversations[conversationKey])
          // Initialize new conversation in order for ui to render conversation messages properly when the first message is sent
          nextState.conversations = {
            ...state.conversations,
            [conversationKey]: {
              messages: [],
              canLoadMore: false,
              initialized: false, // Has to be false as it can be out of sync so we have to fetch conversation messages no matter what
            },
          };
      }

      return nextState;
    });
  }

  @Action(SetUnreadNotification)
  private setUnreadNotification(context: StateContext<AppStateModel>, action: SetUnreadNotification): void {
    context.setState((state) => ({
      ...state,
      unreadNotification: action.payload,
    }));
  }

  @Action(AddOpinionToFavorites)
  private addOpinionToFavorites(
    _: StateContext<OpinionsStateModel>,
    action: AddOpinionToFavorites,
  ): Observable<unknown> {
    return this.opinionService.addOpinionToFavorites(action.payload.opinionId).pipe(
      tap(({data}) => {
        if (data?.addOpinionToFavorites.success === false)
          throw new Error(AddOpinionToFavoritesFailReason.UniqueViolation); // Duplicate entry
        else if (!data?.addOpinionToFavorites.success) throw new Error(AddOpinionToFavoritesFailReason.Other); // Other error, something went wrong
      }),
    );
  }
}
