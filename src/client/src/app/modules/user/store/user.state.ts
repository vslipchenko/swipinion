import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {GetOpinionsByUsernameQueryResult, Opinion} from '~app/typings/opinion/opinion.interfaces';
import {FetchUserOpinions} from '~app/modules/user/store/user.actions';
import {OpinionService} from '~app/services/opinion/opinion.service';
import {Observable, tap} from 'rxjs';
import {MutationResult} from 'apollo-angular';

export interface UserStateModel {
  opinions: Array<Opinion>;
}

const USER_STATE = new StateToken<UserStateModel>('user');

@State({
  name: USER_STATE,
  defaults: {
    opinions: [],
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
          opinions,
        }));
      }),
    );
  }
}
