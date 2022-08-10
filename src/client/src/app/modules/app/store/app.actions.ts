import {UserRole} from '~app/typings/user/user.enums';
import {UserProfile} from '~app/typings/user/user.interfaces';
import {UserStatusCheck} from '~app/typings/user-status/user-status.interfaces';
import {FetchUserChatPayload} from '~app/typings/user-messages/user-messages.interfaces';

export class UpdateAuthedUserProfileTeaser {
  public static readonly type = '[App] UpdateAuthedUserProfileTeaser';

  public constructor(public payload: Partial<Omit<UserProfile, 'bio'>>) {}
}

export class UpdateUserRole {
  public static readonly type = '[App] UpdateUserRole';

  public constructor(public payload: UserRole) {}
}

export class UpdateUtcTimestamp {
  public static readonly type = '[App] UpdateUtcTimestamp';

  public constructor(public payload: number) {}
}

export class RunUserStatusPolling {
  public static readonly type = '[App] RunUserStatusPolling';

  public constructor(public payload: UserStatusCheck) {}
}

export class FetchUserMessages {
  public static readonly type = '[App] FetchUserMessages';

  public constructor(public payload?: number) {}
}

export class FetchUserChat {
  public static readonly type = '[App] FetchUserChat';

  public constructor(public payload: FetchUserChatPayload) {}
}
