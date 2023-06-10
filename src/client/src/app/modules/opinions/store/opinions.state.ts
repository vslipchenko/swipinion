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
import {differenceBy} from 'lodash-es';

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
    opinionReaction: {opinionId: '', reaction: OpinionReaction.Skip, commented: false},
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
        let opinions = data.getGeneralOpinions?.length
          ? // Reverse data to show cards in order from the highest id to the smallest id
            data.getGeneralOpinions.reverse().map((opinion) => ({
              ...opinion,
              tags: opinion.tags[0] ? opinion.tags : [],
              formattedAgreed: formatStatisticNumber(opinion.agreed),
              formattedDisagreed: formatStatisticNumber(opinion.disagreed),
              formattedComments: formatStatisticNumber(opinion.comments),
            }))
          : [];

        const updateState = (): void => {
          context.setState((state) => {
            const canLoadMore = opinions.length === OPINION_FETCH_LIMIT;

            if (state.opinions.length) {
              if (opinions.length) {
                // const mergedOpinions = [...opinions, ...state.opinions];

                if (state.canLoadMore) {
                  // Assume nextOpinions does not have duplicates (assign as is)
                  // Prepended opinions are distinct from state.opinions
                  opinions = [...opinions, ...state.opinions];
                } else {
                  // Check for duplicates and remove in a case if some opinions already on the UI (state.opinions.length)
                  // It happens when there is no more opinions to load (canLoadMore = false)
                  // And remaining few have not received any user reaction, so the server returns same opinions that remained on the UI
                  // (as there is no way for it to know what opinions are currently on the UI)
                  // duplicating existing opinions

                  // Filter to get only distinct opinions
                  const distinctOpinions = differenceBy(state.opinions, opinions, 'id');

                  if (distinctOpinions.length) {
                    opinions = [...distinctOpinions, ...state.opinions];
                  } else {
                    // Assume state.opinions have not changed assigning same reference
                    opinions = state.opinions;
                  }
                }
              } else {
                // Assume state.opinions have not changed
                return {
                  ...state,
                  canLoadMore,
                };
              }
            }

            return {
              ...state,
              opinions,
              canLoadMore,
            };
          });
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
            opinionId,
            reaction,
            commented: Boolean(comment),
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
