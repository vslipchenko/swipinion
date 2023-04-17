import {OpinionsContainerSizes} from '~app/typings/opinions/opinions.interfaces';

export class FetchGeneralOpinions {
  public static readonly type = '[Opinions] FetchGeneralOpinions';

  public constructor(public payload?: string) {}
}

export class SetContainerSizes {
  public static readonly type = '[Opinions] SetContainerSizes';

  public constructor(public payload: OpinionsContainerSizes) {}
}
