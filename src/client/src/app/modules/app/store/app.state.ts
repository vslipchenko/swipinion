import {Action, State, StateContext, StateToken, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
  FetchUserChat,
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
import {UIUserMessage, UnreadMessage} from '~app/typings/user-messages/user-messages.interfaces';
import {
  determineMessageTimePoint,
  timestampToMonthDay,
  timestampToMonthDayYear,
  timestampToTime,
} from '~app/utilities/date';
import {MessageTimePoint} from '~app/typings/date/date.enums';

export interface AppStateModel {
  user: UserEssentials;
  messages: Array<UIUserMessage>;
  chats: {[key: string]: unknown};
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
    chats: {},
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

        context.setState((state) => ({
          ...state,
          ...data.checkUserStatus,
        }));
      }),
    );
  }

  @Action(FetchUserMessages)
  private fetchUserMessages(context: StateContext<AppStateModel>, action: FetchUserMessages): Observable<unknown> {
    return this.userMessagesService.fetchUserMessages(action.payload).pipe(
      tap(({data}) => {
        if (!data.fetchUserMessages) return;

        context.setState((state) => {
          const messages: Array<UIUserMessage> = data.fetchUserMessages.map((message) => {
            const timePoint = determineMessageTimePoint(message.created_at);
            let date;

            switch (timePoint) {
              case MessageTimePoint.TODAY:
                date = timestampToTime(message.created_at);
                break;
              case MessageTimePoint.THIS_YEAR:
                date = timestampToMonthDay(message.created_at);
                break;
              default:
                date = timestampToMonthDayYear(message.created_at);
            }

            const nextMessage: UIUserMessage = {
              ...message,
              unread: false,
              date,
            };
            // Mark unread if sender is not current user and read value is false
            if (!message.read) nextMessage.unread = message.sender_id !== state.user.id;

            return nextMessage;
          });

          const nextState = {
            ...state,
            messages: [...state.messages, ...messages],
          };

          // if (!action.payload) {
          //   // This one is needed in order to fix discrepancy when inactive tab has a stale unreadMessageTimestamp on message fetch
          //   const unreadMessage = messages.find((item) => !item.read);
          //
          //   if (unreadMessage) nextState.unreadMessageTimestamp = unreadMessage.created_at;
          // }

          return nextState;
        });
      }),
    );
  }

  @Action(FetchUserChat)
  private fetchUserChat(context: StateContext<AppStateModel>, action: FetchUserChat): Observable<unknown> {
    return this.userMessagesService.fetchUserChat(action.payload).pipe(
      tap(({data}) => {
        if (!data.fetchUserChat) return;

        context.setState((state) => {
          return {...state};
        });
      }),
    );
  }
}
