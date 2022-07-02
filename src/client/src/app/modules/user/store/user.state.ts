import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
  DeleteOpinionMutationResult,
  GetOpinionsByUsernameQueryResult,
  Opinion,
} from '~app/typings/opinion/opinion.interfaces';
import {DeleteUserOpinion, FetchOpinions, PrependUserOpinion} from '~app/modules/user/store/user.actions';
import {OpinionService} from '~app/services/opinion/opinion.service';
import {Observable, tap} from 'rxjs';
import {MutationResult} from 'apollo-angular';
import {OPINION_FETCH_LIMIT} from '~app/constants/opinions';

export interface UserStateModel {
  profileOpinions: Array<Opinion>;
  userOpinions: Array<Opinion>;
  canLoadMore: boolean;
}

const USER_STATE = new StateToken<UserStateModel>('user');

@State({
  name: USER_STATE,
  defaults: {
    profileOpinions: [],
    userOpinions: [], // Used 2 separated properties in order to prevent values mixing
    canLoadMore: false,
  },
})
@Injectable()
export class UserState {
  public constructor(private readonly opinionService: OpinionService) {
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

            nextState[stateKey] = [...state[stateKey], ...opinions];

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
}
