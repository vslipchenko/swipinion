export class UpdateUserProfile {
  public static readonly type = '[App] UpdateUserProfile';

  public constructor(public payload: {thumbnail: string; bio: string; username?: string}) {}
}
