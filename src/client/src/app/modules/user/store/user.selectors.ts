import {createSelector} from '@ngxs/store';
import {UserState, UserStateModel} from '~app/modules/user/store/user.state';

export class UserSelectors {
  public static opinions = createSelector([UserState], (state: UserStateModel) => {
    return state.opinions;
  });
}
