import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
  DeleteOpinionMutationResult,
  GetOpinionsByUsernameQueryResult,
  Opinion,
} from '~app/typings/opinion/opinion.interfaces';
import {
  DeleteUserOpinion,
  EditUserProfile,
  FetchOpinions,
  FetchUserSettings,
  FollowUser,
  PrependUserOpinion,
  UnfollowUser,
  UpdateResolvedUserData,
  UpdateUserSettings,
} from '~app/modules/user/store/user.actions';
import {OpinionService} from '~app/services/opinion/opinion.service';
import {map, Observable, tap, throwError} from 'rxjs';
import {MutationResult} from 'apollo-angular';
import {OPINION_FETCH_LIMIT} from '~app/constants/opinions';
import {FollowerService} from '~app/services/follower/follower.service';
import {FollowUserMutationResult, UnfollowUserMutationResult} from '~app/typings/follower/follower.interfaces';
import {GetUserSettingsQueryResult, UserSettings} from '~app/typings/user-settings/user-settings.interfaces';
import {FollowSettings, PrivacyCommonSettings} from '~app/typings/user-settings/user-settings.enums';
import {UserSettingsService} from '~app/services/user-settings/user-settings.service';
import {ApolloQueryResult} from '@apollo/client/core';

export interface UserStateModel {
  id: string; // Resolved user id
  username: string; // Resolved user username
  bio: string; // Resolved user bio
  thumbnail: string; // Resolved user thumbnail; TODO might be a room for a small improvement; can be excluded from query as it might be present for the /profile route
  settings: UserSettings;
  userOpinions: Array<Opinion>; // Resolved user opinions; Used 2 separated properties in order to prevent values mixing
  profileOpinions: Array<Opinion>; // Authed user opinions
  isProfilePath: boolean; // Used to discern /profile and /user/foo pages
  following: boolean; // Whether authed user follows resolved
  canLoadMore: boolean;
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
    isProfilePath: false,
    following: false,
    canLoadMore: false,
  },
})
@Injectable()
export class UserState {
  public constructor(
    private readonly opinionService: OpinionService,
    private readonly followerService: FollowerService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  @Action(UpdateResolvedUserData)
  private updateResolvedUserData(context: StateContext<UserStateModel>, action: UpdateResolvedUserData): void {
    context.setState((state) => ({
      ...state,
      ...action.payload,
    }));
  }

  @Action(FetchOpinions)
  private fetchUserOpinions(
    context: StateContext<UserStateModel>,
    action: FetchOpinions,
  ): Observable<MutationResult<GetOpinionsByUsernameQueryResult>> {
    return this.opinionService
      .getOpinionsByUsername({
        username: action.payload.username,
        offset: action.payload.offset,
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
              canLoadMore: opinions.length === OPINION_FETCH_LIMIT,
            };
            const stateKey = action.payload.isProfilePath ? 'profileOpinions' : 'userOpinions';

            nextState[stateKey] = action.payload.offset ? [...state[stateKey], ...opinions] : opinions; // Offset check prevents duplicating when navigating back and forth between /profile and /user/:username paths

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
    return this.opinionService.deleteOpinion(action.payload).pipe(
      tap(({data}) => {
        if (!data?.deleteOpinion) return;

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
        if (!data?.followUser.success) return;

        context.setState((state) => ({
          ...state,
          following: true,
        }));
      }),
    );
  }

  @Action(UnfollowUser)
  private unfollowUser(
    context: StateContext<UserStateModel>,
    action: UnfollowUser,
  ): Observable<MutationResult<UnfollowUserMutationResult>> {
    return this.followerService.unfollowUser(action.payload).pipe(
      tap(({data}) => {
        if (!data?.unfollowUser.success) return;

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

  @Action(FetchUserSettings)
  private fetchUserSettings(
    context: StateContext<UserStateModel>,
  ): Observable<ApolloQueryResult<GetUserSettingsQueryResult>> {
    return this.userSettingsService.getUserSettings().pipe(
      tap(({data}) => {
        if (!data.userSettings) return;

        context.setState((state) => ({
          ...state,
          settings: {
            ...state.settings,
            ...data.userSettings,
          },
        }));
      }),
    );
  }

  @Action(UpdateUserSettings)
  private updateUserSettings(context: StateContext<UserStateModel>, action: UpdateUserSettings): Observable<unknown> {
    return this.userSettingsService.updateUserSettings(action.payload).pipe(
      map((result) => {
        if (!result.data?.updateUserSettings?.success) return throwError('');

        context.setState((state) => ({
          ...state,
          settings: {
            ...state.settings,
            ...action.payload,
          },
        }));

        return result;
      }),
    );
  }
}
