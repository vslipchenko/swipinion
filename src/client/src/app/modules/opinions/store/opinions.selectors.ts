import {createSelector} from '@ngxs/store';
import {OpinionsState, OpinionsStateModel} from '~app/modules/opinions/store/opinions.state';

export class OpinionsSelectors {
  public static nothingToShow = createSelector([OpinionsState], (state: OpinionsStateModel) => {
    return !state.activeOpinion && !state.canLoadMore;
  });

  public static opinions = createSelector([OpinionsState], (state: OpinionsStateModel) => {
    return state.opinions;
  });

  public static containerSizes = createSelector([OpinionsState], (state: OpinionsStateModel) => {
    return state.containerSizes;
  });

  public static activeOpinion = createSelector([OpinionsState], (state: OpinionsStateModel) => {
    return state.activeOpinion;
  });
}
