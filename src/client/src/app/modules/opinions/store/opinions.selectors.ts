import {createSelector} from '@ngxs/store';
import {OpinionsState, OpinionsStateModel} from '~app/modules/opinions/store/opinions.state';

export class OpinionsSelectors {
  public static nothingToShow = createSelector([OpinionsState], (state: OpinionsStateModel) => {
    return !state.canLoadMore && (!state.opinions.length || state.activeOpinion === state.opinions.at(-1));
  });
}
