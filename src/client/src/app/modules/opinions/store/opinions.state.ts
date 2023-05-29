import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {map, Observable, tap, throwError} from 'rxjs';
import {
  FetchGeneralOpinions,
  ReactToUserOpinion,
  RemoveTopMostOpinion,
  SetContainerSizes,
  ToggleReactionInProgress,
} from '~app/modules/opinions/store/opinions.actions';
import {OpinionService} from '~app/services/opinion/opinion.service';
import {ApolloQueryResult} from '@apollo/client/core';
import {GetGeneralOpinionsQueryResult} from '~app/typings/opinion/opinion.interfaces';
import {OPINION_FETCH_LIMIT} from '~app/constants/opinions';
import {OpinionsContainerSizes} from '~app/typings/opinions/opinions.interfaces';
import {CarouselOpinion} from '~app/typings/opinion/opinion.types';
import {formatStatisticNumber} from '~app/utilities/number';
import {OpinionReaction} from '~app/typings/opinion/opinion.enums';

export interface OpinionsStateModel {
  opinions: Array<CarouselOpinion>;
  opinionReaction: {opinionId: string; reaction: OpinionReaction; commented: boolean};
  //activeOpinion: CarouselOpinion; // Scrolled through and reached last most opinion
  containerSizes: OpinionsContainerSizes;
  reactionInProgress: boolean;
  canLoadMore: boolean;
}

const OPINIONS_STATE = new StateToken<OpinionsStateModel>('opinions');

@State({
  name: OPINIONS_STATE,
  defaults: {
    opinions: [],
    // activeOpinion: {
    //   id: '',
    //   user_id: '',
    //   username: '',
    //   type: OpinionType.Text,
    //   body: '',
    //   file_url: '',
    //   agreed: 0,
    //   disagreed: 0,
    //   comments: 0,
    //   formattedAgreed: '',
    //   formattedDisagreed: '',
    //   formattedComments: '',
    //   commented: false,
    //   tags: [],
    // },
    opinionReaction: {opinionId: '', reaction: OpinionReaction.Agree, commented: false},
    containerSizes: {width: 0, height: 0},
    reactionInProgress: false, // Fixes issue with duplicate id entry if quick spamming reactions
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
              formattedAgreed: formatStatisticNumber(opinion.agreed),
              formattedDisagreed: formatStatisticNumber(opinion.disagreed),
              formattedComments: formatStatisticNumber(opinion.comments),
              agreedWith: false,
              disagreedWith: false,
              commented: false,
            }))
          : [];

        context.setState((state) => ({
          ...state,
          opinions: action.payload ? [...state.opinions, ...opinions] : opinions,
          //activeOpinion: action.payload ? state.activeOpinion : opinions[opinions.length - 1], // Set active opinion on page enter
          canLoadMore: opinions.length === OPINION_FETCH_LIMIT,
        }));
      }),
    );
  }

  @Action(SetContainerSizes)
  private setContainerSizes(context: StateContext<OpinionsStateModel>, action: SetContainerSizes): void {
    context.setState((state) => ({
      ...state,
      containerSizes: action.payload,
    }));
  }

  @Action(RemoveTopMostOpinion)
  private removeTopMostOpinion(context: StateContext<OpinionsStateModel>): void {
    context.setState((state) => {
      const nextOpinions = state.opinions.slice(0, state.opinions.length - 1);

      return {
        ...state,
        opinions: nextOpinions,
        //activeOpinion: nextOpinions[nextOpinions.length - 1],
      };
    });
  }

  @Action(ReactToUserOpinion)
  private reactToUserOpinion(
    context: StateContext<OpinionsStateModel>,
    action: ReactToUserOpinion,
  ): Observable<unknown> {
    const {opinionId, reaction, comment, optimisticStatisticUpdate} = action.payload;

    const updateOpinionStatistic = (): void => {
      context.setState((state) => {
        return {
          ...state,
          opinionReaction: {
            opinionId: action.payload.opinionId,
            reaction: action.payload.reaction,
            commented: Boolean(action.payload.comment),
          },
        };
      });
    };

    if (optimisticStatisticUpdate) updateOpinionStatistic(); // Used for reactions without comments (optimistic UI updated statistic reflection)

    return this.opinionService
      .reactToOpinion({
        opinionId,
        reaction,
        comment,
      })
      .pipe(
        map((result) => {
          if (!result.data?.reactToOpinion?.success) return throwError('');

          if (!optimisticStatisticUpdate) updateOpinionStatistic(); // Used for reactions with comments (non-optimistic/post factum UI)

          return result;
        }),
      );
  }

  @Action(ToggleReactionInProgress)
  private toggleAnimationState(context: StateContext<OpinionsStateModel>, action: ToggleReactionInProgress): void {
    context.setState((state) => ({
      ...state,
      reactionInProgress: action.payload,
    }));
  }
}
