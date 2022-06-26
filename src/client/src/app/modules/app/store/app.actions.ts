import {UserRole} from '~app/typings/user/user.enums';

export class UpdateUserProfile {
  public static readonly type = '[App] UpdateUserProfile';

  public constructor(public payload: {thumbnail: string; bio: string; username?: string}) {}
}

export class UpdateUserRole {
  public static readonly type = '[App] UpdateUserRole';

  public constructor(public payload: UserRole) {}
}
