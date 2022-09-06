import {UnreadMessage} from '~app/typings/user-messages/user-messages.interfaces';

export interface UserStatusCheck {
  checkMessage: boolean;
  checkNotification: boolean;
}

export interface CheckUserStatusQueryResult {
  checkUserStatus: {unreadMessages: Array<UnreadMessage>; unreadNotification: string};
}
