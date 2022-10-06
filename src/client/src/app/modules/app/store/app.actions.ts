import {UserRole} from '~app/typings/user/user.enums';
import {UserEssentials} from '~app/typings/user/user.interfaces';
import {UserStatusCheck} from '~app/typings/user-status/user-status.interfaces';
import {
  FetchUserConversationPayload,
  SendUserMessagePayload,
} from '~app/typings/user-messages/user-messages.interfaces';

export class UpdateUserEssentials {
  public static readonly type = '[App] UpdateUserEssentials';

  public constructor(public payload: Partial<UserEssentials>) {}
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

  public constructor(public payload?: string) {}
}

export class FetchNewUserMessages {
  public static readonly type = '[App] FetchNewUserMessages';

  public constructor(public payload: Array<string>) {}
}

export class FetchUserConversation {
  public static readonly type = '[App] FetchUserConversation';

  public constructor(public payload: FetchUserConversationPayload) {}
}

export class RunConversationMessageStatusCheck {
  public static readonly type = '[App] RunConversationMessageStatusCheck';

  public constructor(public payload: string) {}
}

export class SendUserMessage {
  public static readonly type = '[App] SendUserMessage';

  public constructor(public payload: SendUserMessagePayload) {}
}

export class FetchUserSavedMessages {
  public static readonly type = '[App] FetchUserSavedMessages';

  public constructor(public payload?: string) {}
}
