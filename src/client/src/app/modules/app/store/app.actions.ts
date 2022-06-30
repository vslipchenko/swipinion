import {UserRole} from '~app/typings/user/user.enums';
import {UserProfile} from '~app/typings/user/user.interfaces';

export class UpdateUserProfile {
  public static readonly type = '[App] UpdateUserProfile';

  public constructor(public payload: Omit<Partial<UserProfile>, 'bio'>) {}
}

export class UpdateUserRole {
  public static readonly type = '[App] UpdateUserRole';

  public constructor(public payload: UserRole) {}
}
