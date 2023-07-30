import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {BehaviorSubject, Observable} from 'rxjs';
import {untilDestroyed} from '~app/utilities/operator';
import {UserOpinion} from '~app/typings/user-opinion/user-opinion.interfaces';
import {FetchUserFavorites} from '~app/modules/user/store/user.actions';
import {FetchUserFavoritesPayload} from '~app/typings/user-favorites/user-favorites.intefaces';

@Component({
  selector: 'app-user-favorites-tab',
  templateUrl: './user-favorites-tab.component.html',
  styleUrls: ['./user-favorites-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFavoritesTabComponent implements OnInit {
  @Input() public userId = '';
  @Input() public profileOwner = false;

  @Select(UserSelectors.canLoadMoreFavorites) protected readonly canLoadMoreFavorites$!: Observable<boolean>;

  protected favorites$!: Observable<Array<any>>; // TODO replace any
  protected readonly loading$ = new BehaviorSubject(true);
  protected readonly profile = this.store.selectSnapshot(UserSelectors.profileOwner);
  private readonly untilDestroyed = untilDestroyed();

  public constructor(private readonly store: Store, private readonly actions$: Actions) {
    this.actions$.pipe(this.untilDestroyed(), ofActionCompleted(FetchUserFavorites)).subscribe(() => {
      this.loading$.next(false);
    });
  }

  public ngOnInit(): void {
    this.favorites$ = this.store.select(
      this.profileOwner ? UserSelectors.profileFavorites : UserSelectors.userFavorites,
    );

    this.fetchUserFavorites();
  }

  protected spinnerInView(inView: boolean, opinions: Array<UserOpinion>): void {
    if (!inView) return;

    const edgeId = opinions[opinions.length - 1].id;

    this.fetchUserFavorites(edgeId);
  }

  private fetchUserFavorites(edgeId = ''): void {
    const payload: FetchUserFavoritesPayload = {
      userId: this.userId,
      profileOwner: this.profileOwner,
    };

    if (edgeId) payload.edgeId = edgeId;

    this.store.dispatch(new FetchUserFavorites(payload));
  }
}
