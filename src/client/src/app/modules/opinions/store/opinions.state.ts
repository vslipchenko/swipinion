import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {FetchGeneralOpinions} from '~app/modules/opinions/store/opinions.actions';
import {OpinionService} from '~app/services/opinion/opinion.service';
import {ApolloQueryResult} from '@apollo/client/core';
import {GetGeneralOpinionsQueryResult, Opinion} from '~app/typings/opinion/opinion.interfaces';

export interface OpinionsStateModel {
  opinions: Array<Opinion>;
}

const OPINIONS_STATE = new StateToken<OpinionsStateModel>('opinions');

@State({
  name: OPINIONS_STATE,
  defaults: {
    opinions: [],
  },
})
@Injectable()
export class OpinionsState {
  public constructor(private readonly opinionService: OpinionService) {}

  @Action(FetchGeneralOpinions)
  private fetchGeneralOpinions(
    context: StateContext<OpinionsStateModel>,
    action: FetchGeneralOpinions,
  ): Observable<ApolloQueryResult<GetGeneralOpinionsQueryResult>> {
    return this.opinionService.getGeneralOpinions(action.payload).pipe(
      tap(({data}) => {
        if (!data.getGeneralOpinions) return;

        context.setState((state) => ({
          ...state,
          opinions: action.payload ? [...state.opinions, ...data.getGeneralOpinions] : data.getGeneralOpinions,
        }));
      }),
    );
  }
}
