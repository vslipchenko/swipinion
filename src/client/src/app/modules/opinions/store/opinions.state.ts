import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {FetchGeneralOpinions} from '~app/modules/opinions/store/opinions.actions';
import {OpinionService} from '~app/services/opinion/opinion.service';
import {ApolloQueryResult} from '@apollo/client/core';
import {GetGeneralOpinionsQueryResult, Opinion} from '~app/typings/opinion/opinion.interfaces';
import {OPINION_FETCH_LIMIT} from '~app/constants/opinions';
import {OpinionType} from '~app/typings/opinion/opinion.enums';

export interface OpinionsStateModel {
  opinions: Array<Opinion>;
  activeOpinion: Opinion; // Scrolled through and reached last most opinion
  canLoadMore: boolean;
}

const OPINIONS_STATE = new StateToken<OpinionsStateModel>('opinions');

@State({
  name: OPINIONS_STATE,
  defaults: {
    opinions: [],
    activeOpinion: {
      id: '',
      user_id: '',
      username: '',
      type: OpinionType.Text,
      title: '',
      description: '',
      file_url: '',
      agreed: '',
      disagreed: '',
      comments: '',
      tags: [],
    },
    canLoadMore: false,
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
        const opinions = data.getGeneralOpinions
          ? data.getGeneralOpinions.map((opinion) => ({
              ...opinion,
              tags: opinion.tags[0] ? opinion.tags : [],
            }))
          : [];

        context.setState((state) => ({
          ...state,
          opinions: action.payload ? [...state.opinions, ...opinions] : opinions,
          activeOpinion: action.payload ? state.activeOpinion : opinions[0], // Set active opinion on page enter
          canLoadMore: opinions.length === OPINION_FETCH_LIMIT,
        }));
      }),
    );
  }
}
