export interface GetUserNotificationsQueryResult {
  userNotifications: Array<Notification>;
}

export interface Notification {
  type: number;
  username: string;
  thumbnail: string;
  created_at: number;
}
