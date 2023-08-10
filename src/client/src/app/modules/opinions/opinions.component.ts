import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, combineLatest, debounceTime, fromEvent, map, Observable} from 'rxjs';
import {OpinionReaction, OpinionsView} from '~app/typings/opinion/opinion.enums';
import {OpinionService} from '~app/services/opinion/opinion.service';
import {ActionCompletion, Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {
  AddOpinionToFavorites,
  FetchGeneralOpinions,
  ReactToUserOpinion,
  RemoveOpinionFromFavorites,
  SetContainerSizes,
  TogglePrefetchInProgress,
} from '~app/modules/opinions/store/opinions.actions';
import {OpinionsSelectors} from '~app/modules/opinions/store/opinions.selectors';
import {OpinionSnackbarComponent} from '~app/modules/opinions/components/opinion-snackbar/opinion-snackbar.component';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {CarouselOpinion} from '~app/typings/opinion/opinion.types';
import {untilDestroyed} from '~app/utilities/operator';

@Component({
  selector: 'app-opinions',
  templateUrl: './opinions.component.html',
  styleUrls: ['./opinions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Select(OpinionsSelectors.nothingToShow)
  protected readonly nothingToShow$!: Observable<boolean>;
  @Select(OpinionsSelectors.opinions)
  protected readonly opinions$!: Observable<Array<CarouselOpinion>>;

  protected readonly showLoading$!: Observable<boolean>;

  private readonly loading$ = new BehaviorSubject(true);
  private readonly polling$ = new BehaviorSubject(false);

  private readonly view: OpinionsView;
  private readonly untilDestroyed = untilDestroyed();

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly opinionService: OpinionService,
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly elementRef: ElementRef,
    private readonly snackbar: MatSnackBar,
  ) {
    this.showLoading$ = combineLatest(
      this.loading$,
      this.opinions$,
      this.store.select(OpinionsSelectors.prefetchInProgress),
    ).pipe(
      this.untilDestroyed(),
      map(([loading, opinions, prefetchInProgress]) => {
        if (opinions.length) return false; // If there is opinions left don't show loading spinner

        if (prefetchInProgress) return true; // If prefetch query is still in progress - show loading spinner

        return loading; // Otherwise show loading spinner based on its current value
      }),
    );

    this.actions$
      .pipe(
        this.untilDestroyed(),
        ofActionCompleted(FetchGeneralOpinions, ReactToUserOpinion, AddOpinionToFavorites, RemoveOpinionFromFavorites),
      )
      .subscribe((completion) => {
        if (completion.action instanceof FetchGeneralOpinions) return this.fetchGeneralOpinionsCompleted();

        if (completion.action instanceof ReactToUserOpinion)
          return this.reactToUserOpinionCompleted(completion as ActionCompletion<ReactToUserOpinion>);

        if (completion.action instanceof AddOpinionToFavorites)
          return this.addOpinionToFavoritesCompleted(completion as ActionCompletion<AddOpinionToFavorites>);

        if (completion.action instanceof RemoveOpinionFromFavorites)
          return this.removeOpinionFromFavoritesCompleted(completion as ActionCompletion<RemoveOpinionFromFavorites>);
      });

    this.view = (this.route.snapshot.data as {view: OpinionsView}).view;
  }

  public ngOnInit(): void {
    this.fetchOpinions();
  }

  public ngAfterViewInit(): void {
    fromEvent(window, 'resize')
      .pipe(this.untilDestroyed(), debounceTime(200))
      .subscribe(() => this.setContainerSizes());

    this.setContainerSizes();
  }

  public ngOnDestroy(): void {
    this.loading$.complete();
  }

  protected prefetchOpinions(): void {
    this.store.dispatch(new TogglePrefetchInProgress(true));

    const canLoadMore = this.store.selectSnapshot(OpinionsSelectors.canLoadMore);
    // TODO fix flickering loading spinner overlay when prefetching
    if (canLoadMore) {
      // Load old ones
      const edgeId = this.store.selectSnapshot(OpinionsSelectors.edgeOpinionId);

      this.fetchOpinions({edgeId});
    } else {
      // Try to prefetch new ones
      this.fetchOpinions();
    }
  }

  protected pollNewContent(): void {
    if (this.polling$.value) return; // Polling in progress - skip polling

    this.fetchOpinions({polling: true});
  }

  private setContainerSizes(): void {
    this.store.dispatch(
      new SetContainerSizes({
        width: this.elementRef.nativeElement.clientWidth,
        height: this.elementRef.nativeElement.clientHeight,
      }),
    );
  }

  private fetchOpinions({edgeId, polling}: {edgeId?: string; polling?: boolean} = {}): void {
    polling ? this.polling$.next(true) : this.loading$.next(true);

    if (this.view === OpinionsView.General) this.store.dispatch(new FetchGeneralOpinions(edgeId));
    // TODO implement logic for individual (user opinions) view
  }

  private fetchGeneralOpinionsCompleted(): void {
    this.loading$.next(false);
    this.polling$.next(false);
    // Should do no harm when opinions fetched the first time in ngOnInit
    this.store.dispatch(new TogglePrefetchInProgress(false));
  }

  private addOpinionToFavoritesCompleted(completion: ActionCompletion<AddOpinionToFavorites>): void {
    if (completion.result.error) {
      this.snackbar.openFromComponent(OpinionSnackbarComponent, {
        data: `Something went wrong adding <span class="fw-medium">${completion.action.payload.username}</span>'s opinion to Favorites`,
        panelClass: 'snackbar-error',
      });
      return;
    }

    // Assume success
    this.snackbar.openFromComponent(OpinionSnackbarComponent, {
      data: `<span class="fw-medium">${completion.action.payload.username}</span>'s opinion was successfully added to Favorites`,
      panelClass: 'snackbar-success',
    });
  }

  private removeOpinionFromFavoritesCompleted(completion: ActionCompletion<RemoveOpinionFromFavorites>): void {
    if (completion.result.error) {
      this.snackbar.openFromComponent(OpinionSnackbarComponent, {
        data: `Something went wrong removing <span class="fw-medium">${completion.action.payload.username}</span>'s opinion from Favorites`,
        panelClass: 'snackbar-error',
      });
      return;
    }

    // Assume success
    this.snackbar.openFromComponent(OpinionSnackbarComponent, {
      data: `<span class="fw-medium">${completion.action.payload.username}</span>'s opinion was successfully removed from Favorites`,
      panelClass: 'snackbar-success',
    });
  }

  private reactToUserOpinionCompleted(completion: ActionCompletion<ReactToUserOpinion>): void {
    if (!completion.result.error) return; // Assume success

    if (completion.action.payload.reaction === OpinionReaction.Skip) return; // Do not report error if reaction is Skip as user does not count it as a reaction

    // Handle error for regular reactions and reactions with comment
    this.snackbar.openFromComponent(OpinionSnackbarComponent, {
      data: `Something went wrong reacting to <span class="fw-medium">${
        completion.action.payload.username
      }</span>'s opinion ${completion.action.payload.comment ? 'with comment' : ''}`,
      panelClass: 'snackbar-error',
    });
  }
}
