import {createSelector} from '@ngxs/store';
import {UserState, UserStateModel} from '~app/modules/user/store/user.state';

export class UserSelectors {
  public static profileOpinionsSlice = createSelector([UserState], (state: UserStateModel) => {
    return state.canLoadMore ? state.profileOpinions.slice(0, state.profileOpinions.length - 1) : state.profileOpinions;
  });

  public static userOpinionsSlice = createSelector([UserState], (state: UserStateModel) => {
    return state.canLoadMore ? state.userOpinions.slice(0, state.userOpinions.length - 1) : state.userOpinions;
  });

  public static canLoadMore = createSelector([UserState], (state: UserStateModel) => {
    return state.canLoadMore;
  });
}
