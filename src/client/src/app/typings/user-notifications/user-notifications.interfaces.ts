export interface GetUserNotificationsQueryResult {
  userNotifications: Array<Notification>;
}

export interface Notification {
  type: number;
  involved_user_id: string;
  created_at: string;
}
