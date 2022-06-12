export class FetchUserOpinions {
  public static readonly type = '[User] FetchUserOpinions';

  public constructor(public payload: {username: string; offset: number}) {}
}
