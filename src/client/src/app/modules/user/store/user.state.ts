import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
  DeleteOpinionMutationResult,
  GetOpinionsByUserIdQueryResult,
} from '~app/typings/user-opinion/user-opinion.interfaces';
import {
  DeleteUserOpinion,
  EditUserProfile,
  FetchUserFavorites,
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
import {USER_FAVORITES_FETCH_LIMIT, USER_OPINION_FETCH_LIMIT} from '~app/constants/opinions';
import {FollowerService} from '~app/services/follower/follower.service';
import {FollowUserMutationResult} from '~app/typings/follow/follow.interfaces';
import {UserSettings} from '~app/typings/user-settings/user-settings.interfaces';
import {FollowSettings, PrivacyCommonSettings} from '~app/typings/user-settings/user-settings.enums';
import {UserFavoritesService} from '~app/services/user-favorites/user-favorites.service';
import {formatStatisticNumber} from '~app/utilities/number';
import {UIUserOpinion} from '~app/typings/user-opinion/user-opinion.types';
import {UserFollowStatus} from '~app/typings/follow/follow.enums';

export interface UserStateModel {
  id: string; // Resolved user id
  username: string; // Resolved user username
  bio: string; // Resolved user bio
  thumbnail: string; // Resolved user thumbnail; TODO might be a room for a small improvement; can be excluded from query as it might be present for the /profile route
  settings: UserSettings;
  userOpinions: Array<UIUserOpinion>; // Resolved user opinions; Used 2 separated properties in order to prevent values mixing (adding new opinion viewing other user profile may result in opinion being added to other user opinions) and paves path for caching
  profileOpinions: Array<UIUserOpinion>; // Authed user opinions
  userFavorites: Array<unknown>; // Resolved user reactions
  profileFavorites: Array<unknown>; // Authed user reactions
  profileOwner: boolean; // Whether current profile belongs to authed user
  followStatus: UserFollowStatus;
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
    profileOwner: false,
    followStatus: UserFollowStatus.DoesNotFollow,
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
    private readonly userFavoritesService: UserFavoritesService,
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
  ): Observable<MutationResult<GetOpinionsByUserIdQueryResult>> {
    return this.userOpinionService
      .getOpinionsByUserId({
        userId: action.payload.userId,
        edgeId: action.payload.edgeId,
      })
      .pipe(
        tap(({data}) => {
          const opinions = data?.getOpinionsByUserId
            ? data.getOpinionsByUserId.map((opinion) => {
                return {
                  ...opinion,
                  tags: opinion.tags[0] ? opinion.tags : [],
                  formattedAgreed: formatStatisticNumber(opinion.agreed),
                  formattedDisagreed: formatStatisticNumber(opinion.disagreed),
                  formattedComments: formatStatisticNumber(opinion.comments),
                };
              })
            : [];

          context.setState((state) => {
            const nextState = {
              ...state,
              canLoadMoreOpinions: opinions.length === USER_OPINION_FETCH_LIMIT,
            };
            const stateKey = action.payload.profileOwner ? 'profileOpinions' : 'userOpinions';

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
      profileOpinions: [
        {
          ...action.payload,
          formattedAgreed: '0',
          formattedDisagreed: '0',
          formattedComments: '0',
        },
        ...state.profileOpinions,
      ],
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
          followStatus: data.followUser.pending ? UserFollowStatus.Pending : UserFollowStatus.Follows,
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
          followStatus: UserFollowStatus.DoesNotFollow,
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

  @Action(FetchUserFavorites)
  private fetchUserFavorites(context: StateContext<UserStateModel>, action: FetchUserFavorites): Observable<unknown> {
    return this.userFavoritesService
      .getUserFavorites({
        userId: action.payload.userId,
        edgeId: action.payload.edgeId,
      })
      .pipe(
        tap((result) => {
          if (!result.data.getFavoritesByUserId) return;

          const favorites = result.data.getFavoritesByUserId;

          context.setState((state) => {
            const nextState = {
              ...state,
              canLoadMoreFavorites: favorites.length === USER_FAVORITES_FETCH_LIMIT,
            };

            const stateKey = action.payload.profileOwner ? 'profileFavorites' : 'userFavorites';

            nextState[stateKey] = action.payload.edgeId ? [...state[stateKey], ...favorites] : favorites;

            return nextState;
          });
        }),
      );
  }
}
