import {Opinion} from '~app/typings/opinion/opinion.interfaces';

export class FetchOpinions {
  public static readonly type = '[User] FetchUserOpinions';

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
