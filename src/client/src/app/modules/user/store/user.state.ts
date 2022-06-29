import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {GetOpinionsByUsernameQueryResult, Opinion} from '~app/typings/opinion/opinion.interfaces';
import {FetchUserOpinions, PrependUserOpinion} from '~app/modules/user/store/user.actions';
import {OpinionService} from '~app/services/opinion/opinion.service';
import {Observable, tap} from 'rxjs';
import {MutationResult} from 'apollo-angular';
import {OPINION_FETCH_LIMIT} from '~app/constants/opinions';

export interface UserStateModel {
  opinions: Array<Opinion>;
  canLoadMore: boolean;
}

const USER_STATE = new StateToken<UserStateModel>('user');

@State({
  name: USER_STATE,
  defaults: {
    opinions: [],
    canLoadMore: false,
  },
})
@Injectable()
export class UserState {
  public constructor(private readonly opinionService: OpinionService) {}

  @Action(FetchUserOpinions)
  private fetchUserOpinions(
    context: StateContext<UserStateModel>,
    action: FetchUserOpinions,
  ): Observable<MutationResult<GetOpinionsByUsernameQueryResult>> {
    return this.opinionService.getOpinionsByUsername(action.payload).pipe(
      tap(({data}) => {
        const opinions = data?.getOpinionsByUsername
          ? data.getOpinionsByUsername.map((opinion) => {
              return {
                ...opinion,
                tags: opinion.tags[0] ? opinion.tags : [],
              };
            })
          : [];

        context.setState((state) => ({
          ...state,
          opinions: action.payload.offset ? [...state.opinions, ...opinions] : opinions, // Can't just simply mix current state with a new list, as it might cause bug if navigating between different profiles
          canLoadMore: opinions.length === OPINION_FETCH_LIMIT,
        }));
      }),
    );
  }

  @Action(PrependUserOpinion)
  private prependUserOpinion(context: StateContext<UserStateModel>, action: PrependUserOpinion): void {
    context.setState((state) => ({
      ...state,
      opinions: [action.payload, ...state.opinions],
    }));
  }
}
