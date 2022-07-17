export class FetchUserNotifications {
  public static readonly type = '[UserNotifications] FetchUserNotifications';

  public constructor(public payload: number) {}
}
