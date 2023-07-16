import {FetchUserOpinionsPayload, UserOpinion} from '~app/typings/user-opinion/user-opinion.interfaces';
import {ResolvedUserData, UserProfile} from '~app/typings/user/user.interfaces';
import {UserSettings} from '~app/typings/user-settings/user-settings.interfaces';
import {FetchUserFavoritesPayload} from '~app/typings/user-favorites/user-favorites.intefaces';

export class FetchUserOpinions {
  public static readonly type = '[User] FetchUserOpinions';

  public constructor(public payload: FetchUserOpinionsPayload) {}
}

export class FetchUserFavorites {
  public static readonly type = '[User] FetchUserFavorites';

  public constructor(public payload: FetchUserFavoritesPayload) {}
}

export class PrependUserOpinion {
  public static readonly type = '[User] PrependUserOpinion';

  public constructor(public payload: UserOpinion) {}
}

export class ResetUserOpinions {
  public static readonly type = '[User] ResetUserOpinions';
}

export class DeleteUserOpinion {
  public static readonly type = '[User] DeleteUserOpinion';

  public constructor(public payload: string) {}
}

export class FollowUser {
  public static readonly type = '[User] FollowUser';

  public constructor(public payload: string) {}
}

export class UnfollowUser {
  public static readonly type = '[User] UnfollowUser';

  public constructor(public payload: string) {}
}

// export class UpdateFollowingStatus {
//   public static readonly type = '[User] UpdateFollowingStatus';
//
//   public constructor(public payload: boolean) {}
// }

export class UpdateResolvedUserData {
  public static readonly type = '[User] UpdateResolvedUserData';

  public constructor(public payload: ResolvedUserData) {}
}

export class EditUserProfile {
  public static readonly type = '[User] EditUserProfile';

  public constructor(public payload: Omit<UserProfile, 'username'>) {}
}

export class SetUserSettings {
  public static readonly type = '[User] SetUserSettings';

  public constructor(public payload: UserSettings) {}
}
