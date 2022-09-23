import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject, takeUntil} from 'rxjs';
import {Opinion} from '~app/typings/opinion/opinion.interfaces';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {FetchOpinions} from '~app/modules/user/store/user.actions';
import {UserNavbarService} from '~app/services/user-navbar/user-navbar.service';
import {Destroyable} from '~app/typings/component/component.interfaces';

@Component({
  selector: 'app-user-opinions-tab',
  templateUrl: './user-opinions-tab.component.html',
  styleUrls: ['./user-opinions-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOpinionsTabComponent implements OnInit, Destroyable {
  @Input() public username = '';
  @Input() public isProfilePath = false;

  @Select(UserSelectors.canLoadMore) public readonly canLoadMore$!: Observable<Array<Opinion>>;

  public readonly opinions$!: Observable<Array<Opinion>>;
  public readonly loading$ = new BehaviorSubject(true);
  public readonly disableLoadMore$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly store: Store,
    private readonly userNavbarService: UserNavbarService,
    private readonly actions$: Actions,
  ) {
    this.actions$.pipe(takeUntil(this.destroy$), ofActionCompleted(FetchOpinions)).subscribe(() => {
      this.loading$.next(false);
      this.disableLoadMore$.next(false);
    });

    this.isProfilePath = this.store.selectSnapshot(UserSelectors.isProfilePath);

    this.opinions$ = this.store.select(
      this.isProfilePath ? UserSelectors.profileOpinionsSlice : UserSelectors.userOpinionsSlice,
    );
  }

  public ngOnInit(): void {
    this.fetchUserOpinions(0);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public shareOpinion(): void {
    this.userNavbarService.shareOpinion$.next();
  }

  public fetchUserOpinions(offset: number): void {
    this.disableLoadMore$.next(true);

    this.store.dispatch(
      new FetchOpinions({
        username: this.username,
        offset,
        isProfilePath: this.isProfilePath,
      }),
    );
  }
}
