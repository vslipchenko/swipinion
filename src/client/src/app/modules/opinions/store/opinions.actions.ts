import {OpinionsContainerSizes} from '~app/typings/opinions/opinions.interfaces';
import {ReactToOpinion} from '~app/typings/opinion/opinion.interfaces';

export class FetchGeneralOpinions {
  public static readonly type = '[Opinions] FetchGeneralOpinions';

  public constructor(public payload?: string) {}
}

export class SetContainerSizes {
  public static readonly type = '[Opinions] SetContainerSizes';

  public constructor(public payload: OpinionsContainerSizes) {}
}

export class RemoveTopMostOpinion {
  public static readonly type = '[Opinions] RemoveTopMostOpinion';
}

export class ReactToUserOpinion {
  public static readonly type = '[Opinions] ReactToUserOpinion';

  public constructor(public payload: ReactToOpinion & {optimisticStatisticUpdate: boolean}) {}
}
