import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
  DeleteOpinionMutationResult,
  GetOpinionsByUsernameQueryResult,
  UserOpinion,
} from '~app/typings/user-opinion/user-opinion.interfaces';
import {
  DeleteUserOpinion,
  EditUserProfile,
  FetchUserOpinions,
  FollowUser,
  PrependUserOpinion,
  SetUserSettings,
  UnfollowUser,
  UpdateResolvedUserData,
} from '~app/modules/user/store/user.actions';
import {UserOpinionService} from '~app/services/user-opinion/user-opinion.service';
import {Observable, tap} from 'rxjs';
import {MutationResult} from 'apollo-angular';
import {USER_OPINION_FETCH_LIMIT} from '~app/constants/opinions';
import {FollowerService} from '~app/services/follower/follower.service';
import {FollowUserMutationResult} from '~app/typings/follower/follower.interfaces';
import {UserSettings} from '~app/typings/user-settings/user-settings.interfaces';
import {FollowSettings, PrivacyCommonSettings} from '~app/typings/user-settings/user-settings.enums';

export interface UserStateModel {
  id: string; // Resolved user id
  username: string; // Resolved user username
  bio: string; // Resolved user bio
  thumbnail: string; // Resolved user thumbnail; TODO might be a room for a small improvement; can be excluded from query as it might be present for the /profile route
  settings: UserSettings;
  userOpinions: Array<UserOpinion>; // Resolved user opinions; Used 2 separated properties in order to prevent values mixing and paves path for caching
  profileOpinions: Array<UserOpinion>; // Authed user opinions
  userFavorites: Array<unknown>; // Resolved user reactions
  profileFavorites: Array<unknown>; // Authed user reactions
  isProfilePath: boolean; // Used to discern /profile and /user/foo pages
  following: boolean; // Whether authed user follows resolved
  pending: boolean; // Pending following
  canLoadMoreOpinions: boolean;
  canLoadMoreReactions: boolean;
  canLoadMoreFavorites: boolean;
}

const USER_STATE = new StateToken<UserStateModel>('user');

@State({
  name: USER_STATE,
  defaults: {
    id: '',
    username: '',
    bio: '',
    thumbnail: '',
    settings: {
      follow: FollowSettings.Everyone,
      view_following: PrivacyCommonSettings.Everyone,
      message: PrivacyCommonSettings.Everyone,
      view_opinions: PrivacyCommonSettings.Everyone,
      view_reactions: PrivacyCommonSettings.Everyone,
      view_favorites: PrivacyCommonSettings.Everyone,
    },
    userOpinions: [],
    profileOpinions: [],
    userFavorites: [],
    profileFavorites: [],
    isProfilePath: false,
    following: false,
    pending: false,
    canLoadMoreOpinions: false,
    canLoadMoreReactions: false,
    canLoadMoreFavorites: false,
  },
})
@Injectable()
export class UserState {
  public constructor(
    private readonly userOpinionService: UserOpinionService,
    private readonly followerService: FollowerService,
  ) {}

  @Action(UpdateResolvedUserData)
  private updateResolvedUserData(context: StateContext<UserStateModel>, action: UpdateResolvedUserData): void {
    context.setState((state) => ({
      ...state,
      ...action.payload,
    }));
  }

  @Action(FetchUserOpinions)
  private fetchUserOpinions(
    context: StateContext<UserStateModel>,
    action: FetchUserOpinions,
  ): Observable<MutationResult<GetOpinionsByUsernameQueryResult>> {
    return this.userOpinionService
      .getOpinionsByUsername({
        username: action.payload.username,
        edgeId: action.payload.edgeId,
      })
      .pipe(
        tap(({data}) => {
          const opinions = data?.getOpinionsByUsername
            ? data.getOpinionsByUsername.map((opinion) => {
                return {
                  ...opinion,
                  tags: opinion.tags[0] ? opinion.tags : [],
                };
              })
            : [];

          context.setState((state) => {
            const nextState = {
              ...state,
              canLoadMoreOpinions: opinions.length === USER_OPINION_FETCH_LIMIT,
            };
            const stateKey = action.payload.isProfilePath ? 'profileOpinions' : 'userOpinions';

            nextState[stateKey] = action.payload.edgeId ? [...state[stateKey], ...opinions] : opinions; // EdgeId check prevents duplicating when navigating back and forth between /profile and /user/:username paths

            return nextState;
          });
        }),
      );
  }

  @Action(PrependUserOpinion)
  private prependUserOpinion(context: StateContext<UserStateModel>, action: PrependUserOpinion): void {
    context.setState((state) => ({
      ...state,
      profileOpinions: [action.payload, ...state.profileOpinions],
    }));
  }

  @Action(DeleteUserOpinion)
  private deleteUserOpinion(
    context: StateContext<UserStateModel>,
    action: DeleteUserOpinion,
  ): Observable<MutationResult<DeleteOpinionMutationResult>> {
    return this.userOpinionService.deleteOpinion(action.payload).pipe(
      tap(({data}) => {
        if (!data?.deleteOpinion?.success) return;

        context.setState((state) => ({
          ...state,
          profileOpinions: state.profileOpinions.filter((opinion) => opinion.id !== action.payload),
        }));
      }),
    );
  }

  // @Action(UpdateFollowingStatus)
  // private updateFollowingStatus(context: StateContext<UserStateModel>, action: UpdateFollowingStatus): void {
  //   context.setState((state) => ({
  //     ...state,
  //     following: action.payload,
  //   }));
  // }

  @Action(FollowUser)
  private followUser(
    context: StateContext<UserStateModel>,
    action: FollowUser,
  ): Observable<MutationResult<FollowUserMutationResult>> {
    return this.followerService.followUser(action.payload).pipe(
      tap(({data}) => {
        if (!data?.followUser) return;

        context.setState((state) => ({
          ...state,
          following: true,
          pending: data.followUser.pending,
        }));
      }),
    );
  }

  @Action(UnfollowUser)
  private unfollowUser(context: StateContext<UserStateModel>, action: UnfollowUser): Observable<unknown> {
    return this.followerService.unfollowUser(action.payload).pipe(
      tap((result) => {
        if (!result.data?.unfollowUser.success) throw new Error();

        context.setState((state) => ({
          ...state,
          following: false,
        }));
      }),
    );
  }

  @Action(EditUserProfile)
  private editUserProfile(context: StateContext<UserStateModel>, action: EditUserProfile): void {
    context.setState((state) => ({
      ...state,
      ...action.payload,
    }));
  }

  @Action(SetUserSettings)
  private updateUserSettings(context: StateContext<UserStateModel>, action: SetUserSettings): void {
    context.setState((state) => ({
      ...state,
      settings: {
        ...state.settings,
        ...action.payload,
      },
    }));
  }
}
