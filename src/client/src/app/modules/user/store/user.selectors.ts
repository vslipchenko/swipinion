import {createSelector} from '@ngxs/store';
import {UserState, UserStateModel} from '~app/modules/user/store/user.state';
import {ResolvedUserData} from '~app/typings/user/user.interfaces';

export class UserSelectors {
  public static resolvedUserData = createSelector([UserState], (state: UserStateModel): ResolvedUserData => {
    return {
      id: state.id,
      username: state.username,
      thumbnail: state.thumbnail,
      bio: state.bio,
      isProfilePath: state.isProfilePath,
      following: state.following,
    };
  });

  public static profileOpinionsSlice = createSelector([UserState], (state: UserStateModel) => {
    return state.canLoadMore ? state.profileOpinions.slice(0, state.profileOpinions.length - 1) : state.profileOpinions;
  });

  public static userOpinionsSlice = createSelector([UserState], (state: UserStateModel) => {
    return state.canLoadMore ? state.userOpinions.slice(0, state.userOpinions.length - 1) : state.userOpinions;
  });

  public static canLoadMore = createSelector([UserState], (state: UserStateModel) => {
    return state.canLoadMore;
  });

  public static following = createSelector([UserState], (state: UserStateModel) => {
    return state.following;
  });

  public static profileSettings = createSelector([UserState], (state: UserStateModel) => {
    return state.profileSettings;
  });

  public static userSettings = createSelector([UserState], (state: UserStateModel) => {
    return state.userSettings;
  });

  public static isProfilePath = createSelector([UserState], (state: UserStateModel) => {
    return state.isProfilePath;
  });
}
