import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, debounceTime, fromEvent, Observable, Subject, takeUntil} from 'rxjs';
import {OpinionsView} from '~app/typings/opinion/opinion.enums';
import {OpinionService} from '~app/services/opinion/opinion.service';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {FetchGeneralOpinions, SetContainerSizes} from '~app/modules/opinions/store/opinions.actions';
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

  private readonly view: OpinionsView;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly opinionService: OpinionService,
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly elementRef: ElementRef,
  ) {
    this.actions$.pipe(takeUntil(this.destroy$), ofActionCompleted(FetchGeneralOpinions)).subscribe(() => {
      this.loading$.next(false);
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
  }
}
