import {Action, State, StateContext, StateToken, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {
  AddOpinionToFavorites,
  FetchGeneralOpinions,
  ReactToUserOpinion,
  RemoveTopMostOpinion,
  SetContainerSizes,
  TogglePrefetchInProgress,
  ToggleReactionInProgress,
} from '~app/modules/opinions/store/opinions.actions';
import {OpinionService} from '~app/services/opinion/opinion.service';
import {ApolloQueryResult} from '@apollo/client/core';
import {GetGeneralOpinionsQueryResult} from '~app/typings/opinion/opinion.interfaces';
import {OPINION_FETCH_LIMIT} from '~app/constants/opinions';
import {OpinionsContainerSizes} from '~app/typings/opinions/opinions.interfaces';
import {CarouselOpinion} from '~app/typings/opinion/opinion.types';
import {formatStatisticNumber} from '~app/utilities/number';
import {AddOpinionToFavoritesFailReason, OpinionReaction} from '~app/typings/opinion/opinion.enums';
import {OpinionsSelectors} from '~app/modules/opinions/store/opinions.selectors';

export interface OpinionsStateModel {
  opinions: Array<CarouselOpinion>;
  opinionReaction: {opinionId: string; reaction: OpinionReaction; commented: boolean};
  //activeOpinion: CarouselOpinion; // Scrolled through and reached last most opinion
  containerSizes: OpinionsContainerSizes;
  reactionInProgress: boolean;
  prefetchInProgress: boolean;
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
    prefetchInProgress: false,
    canLoadMore: false,
  },
})
@Injectable()
export class OpinionsState {
  public constructor(private readonly opinionService: OpinionService, private readonly store: Store) {}

  @Action(FetchGeneralOpinions)
  private fetchGeneralOpinions(
    context: StateContext<OpinionsStateModel>,
    action: FetchGeneralOpinions,
  ): Observable<ApolloQueryResult<GetGeneralOpinionsQueryResult>> {
    return this.opinionService.getGeneralOpinions(action.payload).pipe(
      tap(({data}) => {
        const opinions = data.getGeneralOpinions
          ? data.getGeneralOpinions.reverse().map((opinion) => ({
              ...opinion,
              tags: opinion.tags[0] ? opinion.tags : [],
              formattedAgreed: formatStatisticNumber(opinion.agreed),
              formattedDisagreed: formatStatisticNumber(opinion.disagreed),
              formattedComments: formatStatisticNumber(opinion.comments),
            }))
          : [];

        const updateState = (): void => {
          context.setState((state) => ({
            ...state,
            opinions: state.opinions.length ? [...opinions, ...state.opinions] : opinions,
            //activeOpinion: action.payload ? state.activeOpinion : opinions[opinions.length - 1], // Set active opinion on page enter
            canLoadMore: opinions.length === OPINION_FETCH_LIMIT,
          }));
        };

        if (opinions.length) {
          // Check for opinions.length to avoid useless subscription
          const {reactionInProgress} = context.getState();

          if (reactionInProgress) {
            // Wait until animation is completed to avoid UI re-rendering amidst animation
            this.store.selectOnce(OpinionsSelectors.reactionInProgress).subscribe(updateState); // Assume reactionInProgress is false once emits
            return;
          }
        }

        updateState();
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
        tap((result) => {
          if (!result.data?.reactToOpinion.success) throw new Error();

          if (!optimisticStatisticUpdate) updateOpinionStatistic(); // Used for reactions with comments (non-optimistic/post factum UI)
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

  @Action(TogglePrefetchInProgress)
  private togglePrefetchInProgress(context: StateContext<OpinionsStateModel>, action: TogglePrefetchInProgress): void {
    context.setState((state) => ({
      ...state,
      prefetchInProgress: action.payload,
    }));
  }

  @Action(AddOpinionToFavorites)
  private addOpinionToFavorites(
    _: StateContext<OpinionsStateModel>,
    action: AddOpinionToFavorites,
  ): Observable<unknown> {
    return this.opinionService.addOpinionToFavorites(action.payload.opinionId).pipe(
      tap(({data}) => {
        if (data?.addOpinionToFavorites.success === false)
          throw new Error(AddOpinionToFavoritesFailReason.UniqueViolation); // Duplicate entry
        else if (!data?.addOpinionToFavorites.success) throw new Error(AddOpinionToFavoritesFailReason.Other); // Other error, something went wrong
      }),
    );
  }
}
