import {createSelector} from '@ngxs/store';
import {UserState, UserStateModel} from '~app/modules/user/store/user.state';
import {ResolvedUserData, ResolvedUserEssentials} from '~app/typings/user/user.interfaces';
import {UserFollowStatus} from '~app/typings/follow/follow.enums';

export class UserSelectors {
  public static resolvedUserData = createSelector([UserState], (state: UserStateModel): ResolvedUserData => {
    return {
      id: state.id,
      username: state.username,
      thumbnail: state.thumbnail,
      bio: state.bio,
      profileOwner: state.profileOwner,
      followStatus: state.followStatus,
    };
  });

  public static resolvedUserEssentials = createSelector(
    [UserState],
    (state: UserStateModel): ResolvedUserEssentials => {
      return {
        id: state.id,
        username: state.username,
        thumbnail: state.thumbnail,
      };
    },
  );

  public static resolvedUserUsername = createSelector([UserState], (state: UserStateModel) => {
    return state.username;
  });

  public static profileOpinions = createSelector([UserState], (state: UserStateModel) => {
    return state.profileOpinions;
  });

  public static userOpinions = createSelector([UserState], (state: UserStateModel) => {
    return state.userOpinions;
  });

  public static profileFavorites = createSelector([UserState], (state: UserStateModel) => {
    return state.profileFavorites;
  });

  public static userFavorites = createSelector([UserState], (state: UserStateModel) => {
    return state.userFavorites;
  });

  public static canLoadMoreOpinions = createSelector([UserState], (state: UserStateModel) => {
    return state.canLoadMoreOpinions;
  });

  public static canLoadMoreReactions = createSelector([UserState], (state: UserStateModel) => {
    return state.canLoadMoreReactions;
  });

  public static canLoadMoreFavorites = createSelector([UserState], (state: UserStateModel) => {
    return state.canLoadMoreFavorites;
  });

  public static settings = createSelector([UserState], (state: UserStateModel) => {
    return state.settings;
  });

  public static profileOwner = createSelector([UserState], (state: UserStateModel) => {
    return state.profileOwner;
  });

  public static followStatus = createSelector([UserState], (state: UserStateModel): UserFollowStatus => {
    return state.followStatus;
  });
}
