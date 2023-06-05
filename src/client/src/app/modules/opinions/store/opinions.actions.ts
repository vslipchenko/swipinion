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

export class ToggleReactionInProgress {
  public static readonly type = '[Opinions] ToggleReactionInProgress';

  public constructor(public payload: boolean) {}
}

export class TogglePrefetchInProgress {
  public static readonly type = '[Opinions] TogglePrefetchInProgress';

  public constructor(public payload: boolean) {}
}

export class AddOpinionToFavorites {
  public static readonly type = '[Opinions] AddOpinionToFavorites';

  public constructor(public payload: {opinionId: string; username: string}) {}
}
