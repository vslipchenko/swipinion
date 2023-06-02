import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, combineLatest, debounceTime, fromEvent, map, Observable, Subject, takeUntil} from 'rxjs';
import {OpinionsView} from '~app/typings/opinion/opinion.enums';
import {OpinionService} from '~app/services/opinion/opinion.service';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {
  FetchGeneralOpinions,
  SetContainerSizes,
  TogglePrefetchInProgress,
} from '~app/modules/opinions/store/opinions.actions';
import {OpinionsSelectors} from '~app/modules/opinions/store/opinions.selectors';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {Opinion} from '~app/typings/opinion/opinion.interfaces';

@Component({
  selector: 'app-opinions',
  templateUrl: './opinions.component.html',
  styleUrls: ['./opinions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionsComponent implements OnInit, AfterViewInit, Destroyable {
  @Select(OpinionsSelectors.nothingToShow)
  public readonly nothingToShow$!: Observable<boolean>;
  @Select(OpinionsSelectors.opinions)
  public readonly opinions$!: Observable<Array<Opinion>>;

  public readonly loading$ = new BehaviorSubject(true);
  public readonly destroy$ = new Subject<void>();

  protected readonly showLoading$!: Observable<boolean>;

  private readonly view: OpinionsView;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly opinionService: OpinionService,
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly elementRef: ElementRef,
  ) {
    this.showLoading$ = combineLatest(
      this.loading$,
      this.opinions$,
      this.store.select(OpinionsSelectors.prefetchInProgress),
    ).pipe(
      takeUntil(this.destroy$),
      map(([loading, opinions, prefetchInProgress]) => {
        if (opinions.length) return false; // If there is opinions left don't show loading spinner

        if (prefetchInProgress) return true; // If prefetch query is still in progress - show loading spinner

        return loading; // Otherwise show loading spinner based on its current value
      }),
    );

    this.actions$.pipe(takeUntil(this.destroy$), ofActionCompleted(FetchGeneralOpinions)).subscribe(() => {
      this.loading$.next(false);
      // Should do no harm when opinions fetched the first time in ngOnInit
      this.store.dispatch(new TogglePrefetchInProgress(false));
    });

    this.view = (this.route.snapshot.data as {view: OpinionsView}).view;
  }

  public ngOnInit(): void {
    this.fetchOpinions();
  }

  public ngAfterViewInit(): void {
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$), debounceTime(200))
      .subscribe(() => this.setContainerSizes());

    this.setContainerSizes();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  protected prefetchOpinions(): void {
    this.store.dispatch(new TogglePrefetchInProgress(true));

    const canLoadMore = this.store.selectSnapshot(OpinionsSelectors.canLoadMore);
    // TODO fix flickering loading spinner overlay when prefetching
    if (canLoadMore) {
      // Load old ones
      const edgeId = this.store.selectSnapshot(OpinionsSelectors.edgeOpinionId);

      this.fetchOpinions(edgeId);
    } else {
      // Try to prefetch new ones
      this.fetchOpinions();
    }
  }

  private setContainerSizes(): void {
    this.store.dispatch(
      new SetContainerSizes({
        width: this.elementRef.nativeElement.clientWidth,
        height: this.elementRef.nativeElement.clientHeight,
      }),
    );
  }

  private fetchOpinions(edgeId?: string): void {
    this.loading$.next(true);

    if (this.view === OpinionsView.General) this.store.dispatch(new FetchGeneralOpinions(edgeId));
    // TODO implement logic for individual (user opinions) view
  }
}
