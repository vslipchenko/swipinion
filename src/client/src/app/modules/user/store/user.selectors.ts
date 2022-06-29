import {createSelector} from '@ngxs/store';
import {UserState, UserStateModel} from '~app/modules/user/store/user.state';

export class UserSelectors {
  public static opinionsSlice = createSelector([UserState], (state: UserStateModel) => {
    return state.canLoadMore ? state.opinions.slice(0, state.opinions.length - 1) : state.opinions;
  });

  public static canLoadMore = createSelector([UserState], (state: UserStateModel) => {
    return state.canLoadMore;
  });
}
