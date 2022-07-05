import {Opinion} from '~app/typings/opinion/opinion.interfaces';
import {ResolvedUserData} from '~app/typings/user/user.interfaces';

export class FetchOpinions {
  public static readonly type = '[User] FetchOpinions';

  public constructor(public payload: {username: string; offset: number; isProfilePath: boolean}) {}
}

export class PrependUserOpinion {
  public static readonly type = '[User] PrependUserOpinion';

  public constructor(public payload: Opinion) {}
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
