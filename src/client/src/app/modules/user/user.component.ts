import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {FetchUserOpinions} from '~app/modules/user/store/user.actions';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Observable} from 'rxjs';
import {Opinion} from '~app/typings/opinion/opinion.interfaces';
import {UserSelectors} from '~app/modules/user/store/user.selectors';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  @Select(UserSelectors.opinions) public readonly opinions$!: Observable<Array<Opinion>>;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(
      new FetchUserOpinions({
        username: this.store.selectSnapshot(AppSelectors.userProfile).username,
        offset: 0,
      }),
    );
  }
}
