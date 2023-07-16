import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, Observable, skip} from 'rxjs';
import {FetchUserOpinionsPayload, UserOpinion} from '~app/typings/user-opinion/user-opinion.interfaces';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {FetchUserOpinions, ResetUserOpinions} from '~app/modules/user/store/user.actions';
import {UserNavbarService} from '~app/services/user-navbar/user-navbar.service';
import {untilDestroyed} from '~app/utilities/operator';
import {UIUserOpinion} from '~app/typings/user-opinion/user-opinion.types';
import {UserSettings} from '~app/typings/user-settings/user-settings.interfaces';
import {PrivacyCommonSettings} from '~app/typings/user-settings/user-settings.enums';
import {UserFollowingStatus} from '~app/typings/user/user.interfaces';

@Component({
  selector: 'app-user-opinions-tab',
  templateUrl: './user-opinions-tab.component.html',
  styleUrls: ['./user-opinions-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOpinionsTabComponent implements OnInit, OnDestroy {
  @Select(UserSelectors.canLoadMoreOpinions) public readonly canLoadMoreOpinions$!: Observable<boolean>;
  @Select(UserSelectors.followingStatus) public readonly followingStatus$!: Observable<UserFollowingStatus>;

  @Input() public userId = '';
  @Input() public username = '';
  @Input() public isProfilePath = false;

  @Input()
  public set userSettings(settings: UserSettings) {
    if (settings.view_opinions === PrivacyCommonSettings.FollowersOnly) {
      this.followToView = true;

      const followingStatus = this.store.selectSnapshot(UserSelectors.followingStatus);

      if (followingStatus.pending) this.pendingFollowRequest = true;
    } else if (settings.view_opinions === PrivacyCommonSettings.NoOne) this.viewRestricted = true;
  }

  public opinions$!: Observable<Array<UIUserOpinion>>;

  protected readonly loading$ = new BehaviorSubject(false);
  protected followToView = false; // If PrivacyCommonSettings.FollowersOnly is set for view_opinions
  protected pendingFollowRequest = false; // Used to track following pending state
  protected viewRestricted = false; // If PrivacyCommonSettings.NoOne is set for view_opinions

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
    this.opinions$ = this.store.select(this.isProfilePath ? UserSelectors.profileOpinions : UserSelectors.userOpinions);

    if (this.needToFetchOpinions) {
      // Avoid unnecessary requests
      this.loading$.next(true);
      this.fetchUserOpinions();
    }

    if (this.isProfilePath) return;

    this.followingStatus$ // React to following status change
      .pipe(
        this.untilDestroyed(),
        distinctUntilChanged((previous, current) => {
          // Trigger subscription callback only if following condition has changed
          return previous.following === current.following && previous.pending === current.pending;
        }),
        skip(1), // Skip first emitted shared value as it may lead in certain cases to consecutive triggering of fetchUserOpinions
      )
      .subscribe((status) => {
        if (!this.followToView) return; // Skip for view_opinions === PrivacyCommonSettings.Everyone/PrivacyCommonSettings.FollowersOnly

        if (status.following) {
          if (status.pending) {
            // Update pending status to trigger proper user opinions content placeholder
            this.pendingFollowRequest = true;
          } else {
            // Trigger opinions fetch
            this.loading$.next(true);
            this.fetchUserOpinions();
          }
        } else {
          // Remove opinions and update pending status to trigger proper user opinions content placeholder
          this.pendingFollowRequest = false;
          this.store.dispatch(new ResetUserOpinions());
        }
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

    this.fetchUserOpinions(edgeId);
  }

  private fetchUserOpinions(edgeId = ''): void {
    const payload: FetchUserOpinionsPayload = {
      userId: this.userId,
      isProfilePath: this.isProfilePath,
    };

    if (edgeId) payload.edgeId = edgeId;

    this.store.dispatch(new FetchUserOpinions(payload));
  }

  private get needToFetchOpinions(): boolean {
    if (this.isProfilePath) return true; // This is optional as userSettings values in this case are set to PrivacyCommonSettings.Everyone; just to be safe

    if (this.viewRestricted) return false;

    if (this.followToView) {
      const followingStatus = this.store.selectSnapshot(UserSelectors.followingStatus);

      if (followingStatus.following) {
        return !this.pendingFollowRequest;
      } else {
        return false;
      }
    }

    return true;
  }
}
