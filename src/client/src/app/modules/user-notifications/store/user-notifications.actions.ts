import {FetchUserNotificationsPayload} from '~app/typings/user-notifications/user-notifications.interfaces';

export class FetchUserNotifications {
  public static readonly type = '[UserNotifications] FetchUserNotifications';

  public constructor(public payload: FetchUserNotificationsPayload) {}
}

export class AcceptFollowRequest {
  public static readonly type = '[UserNotifications] AcceptFollowRequest';

  public constructor(public payload: string) {}
}

export class DeclineFollowRequest {
  public static readonly type = '[UserNotifications] DeclineFollowRequest';

  public constructor(public payload: string) {}
}

export class DeleteNotification {
  public static readonly type = '[UserNotifications] DeleteNotification';

  public constructor(public payload: string) {}
}
