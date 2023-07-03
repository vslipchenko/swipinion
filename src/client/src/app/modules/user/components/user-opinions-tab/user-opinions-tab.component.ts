import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {FetchUserOpinionsPayload, UserOpinion} from '~app/typings/user-opinion/user-opinion.interfaces';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {FetchUserOpinions} from '~app/modules/user/store/user.actions';
import {UserNavbarService} from '~app/services/user-navbar/user-navbar.service';
import {untilDestroyed} from '~app/utilities/operator';

@Component({
  selector: 'app-user-opinions-tab',
  templateUrl: './user-opinions-tab.component.html',
  styleUrls: ['./user-opinions-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOpinionsTabComponent implements OnInit {
  @Input() public username = '';
  @Input() public isProfilePath = false;

  @Select(UserSelectors.canLoadMore) public readonly canLoadMore$!: Observable<Array<UserOpinion>>;

  public opinions$!: Observable<Array<UserOpinion>>;
  public readonly loading$ = new BehaviorSubject(true);
  private readonly untilDestroyed = untilDestroyed();

  public constructor(
    private readonly store: Store,
    private readonly userNavbarService: UserNavbarService,
    private readonly actions$: Actions,
  ) {
    this.actions$.pipe(this.untilDestroyed(), ofActionCompleted(FetchUserOpinions)).subscribe(() => {
      this.loading$.next(false);
    });
  }

  public ngOnInit(): void {
    this.opinions$ = this.store.select(
      this.isProfilePath ? UserSelectors.profileOpinionsSlice : UserSelectors.userOpinionsSlice,
    );

    this.fetchUserOpinions();
  }

  public ngOnDestroy(): void {
    this.loading$.complete();
  }

  public shareOpinion(): void {
    this.userNavbarService.shareOpinion$.next();
  }

  public fetchUserOpinions(edgeId = ''): void {
    const payload: FetchUserOpinionsPayload = {
      username: this.username,
      isProfilePath: this.isProfilePath,
    };

    if (edgeId) payload.edgeId = edgeId;

    this.store.dispatch(new FetchUserOpinions(payload));
  }

  protected spinnerInView(inView: boolean, opinions: Array<UserOpinion>): void {
    if (!inView) return;

    const edgeId = opinions[opinions.length - 1].id;

    this.fetchUserOpinions(edgeId);
  }
}
