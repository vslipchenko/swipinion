export interface UserStatusCheck {
  checkMessage: boolean;
  checkNotification: boolean;
}

export interface CheckUserStatusQueryResult {
  checkUserStatus: {unreadMessageTimestamp: number; unreadNotificationTimestamp: number};
}
