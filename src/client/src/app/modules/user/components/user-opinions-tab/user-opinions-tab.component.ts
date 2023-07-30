import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {FetchUserOpinionsPayload, UserOpinion} from '~app/typings/user-opinion/user-opinion.interfaces';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {FetchUserOpinions} from '~app/modules/user/store/user.actions';
import {UserNavbarService} from '~app/services/user-navbar/user-navbar.service';
import {untilDestroyed} from '~app/utilities/operator';
import {UIUserOpinion} from '~app/typings/user-opinion/user-opinion.types';
import {PrivacyCommonSettings} from '~app/typings/user-settings/user-settings.enums';
import {UserFollowStatus} from '~app/typings/follow/follow.enums';

@Component({
  selector: 'app-user-opinions-tab',
  templateUrl: './user-opinions-tab.component.html',
  styleUrls: ['./user-opinions-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOpinionsTabComponent implements OnInit, OnDestroy {
  @Select(UserSelectors.canLoadMoreOpinions) public readonly canLoadMoreOpinions$!: Observable<boolean>;
  @Select(UserSelectors.followStatus) public readonly followStatus$!: Observable<UserFollowStatus>;

  @Input() public userId = '';
  @Input() public username = '';
  @Input() public profileOwner = false;
  @Input()
  public viewOpinionsSetting = PrivacyCommonSettings.NoOne;

  public opinions$!: Observable<Array<UIUserOpinion>>;

  protected readonly userFollowStatus = UserFollowStatus;
  protected readonly privacyCommonSettings = PrivacyCommonSettings;
  protected readonly loading$ = new BehaviorSubject(false);

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
    this.opinions$ = this.store.select(this.profileOwner ? UserSelectors.profileOpinions : UserSelectors.userOpinions);

    if (this.profileOwner || this.viewOpinionsSetting === PrivacyCommonSettings.Everyone)
      return this.fetchUserOpinions(true);

    if (this.viewOpinionsSetting === PrivacyCommonSettings.NoOne) return;

    this.followStatus$ // React to follow status change
      .pipe(this.untilDestroyed())
      .subscribe((followStatus) => {
        // Fetch user opinions even if they were already fetched (in case if view_opinions = FollowersOnly and user toggles follow/unfollow)
        if (followStatus === UserFollowStatus.Follows) this.fetchUserOpinions(true);
      });
  }

  public ngOnDestroy(): void {
    this.loading$.complete();
  }

  protected shareOpinion(): void {
    this.userNavbarService.shareOpinion$.next();
  }

  protected followUser(): void {
    // TODO
  }

  protected spinnerInView(inView: boolean, opinions: Array<UserOpinion>): void {
    if (!inView) return;

    const edgeId = opinions[opinions.length - 1].id;

    this.fetchUserOpinions(false, edgeId);
  }

  private fetchUserOpinions(showMainSpinner: boolean, edgeId = ''): void {
    if (showMainSpinner) this.loading$.next(true);

    const payload: FetchUserOpinionsPayload = {
      userId: this.userId,
      profileOwner: this.profileOwner,
    };

    if (edgeId) payload.edgeId = edgeId;

    this.store.dispatch(new FetchUserOpinions(payload));
  }
}
