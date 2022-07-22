import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Opinion} from '~app/typings/opinion/opinion.interfaces';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {Select, Store} from '@ngxs/store';
import {FetchOpinions} from '~app/modules/user/store/user.actions';
import {UserNavbarService} from '~app/services/user-navbar/user-navbar.service';

@Component({
  selector: 'app-user-opinions-tab',
  templateUrl: './user-opinions-tab.component.html',
  styleUrls: ['./user-opinions-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOpinionsTabComponent implements OnInit {
  @Input() public username = '';
  @Input() public isProfilePath = false;

  @Select(UserSelectors.canLoadMore) public readonly canLoadMore$!: Observable<Array<Opinion>>;

  public readonly opinions$!: Observable<Array<Opinion>>;

  public constructor(private readonly store: Store, private readonly userNavbarService: UserNavbarService) {
    this.isProfilePath = this.store.selectSnapshot(UserSelectors.isProfilePath);

    this.opinions$ = this.store.select(
      this.isProfilePath ? UserSelectors.profileOpinionsSlice : UserSelectors.userOpinionsSlice,
    );
  }

  public ngOnInit(): void {
    this.fetchUserOpinions(0);
  }

  public shareOpinion(): void {
    this.userNavbarService.shareOpinion$.next();
  }

  public fetchUserOpinions(offset: number): void {
    this.store.dispatch(
      new FetchOpinions({
        username: this.username,
        offset,
        isProfilePath: this.isProfilePath,
      }),
    );
  }
}
