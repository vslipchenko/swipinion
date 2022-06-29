import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {FetchUserOpinions} from '~app/modules/user/store/user.actions';
import {Observable} from 'rxjs';
import {Opinion} from '~app/typings/opinion/opinion.interfaces';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {MatDialog} from '@angular/material/dialog';
import {EditProfileDialogComponent} from '~app/modules/user/components/edit-profile-dialog/edit-profile-dialog.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  @Select(UserSelectors.opinionsSlice) public readonly opinions$!: Observable<Array<Opinion>>;
  @Select(UserSelectors.canLoadMore) public readonly canLoadMore$!: Observable<Array<Opinion>>;
  public readonly profile: {username: string; thumbnail: string; bio: string};

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
  ) {
    this.profile = this.route.snapshot.data['profile'];
  }

  public ngOnInit(): void {
    this.fetchUserOpinions(0);
  }

  public fetchUserOpinions(offset: number): void {
    this.store.dispatch(
      new FetchUserOpinions({
        username: this.profile.username,
        offset,
      }),
    );
  }

  public openEditProfile(): void {
    this.dialog.open(EditProfileDialogComponent, {
      panelClass: ['dialog', 'extended-dialog'],
      data: {thumbnail: this.profile.thumbnail, bio: this.profile.bio},
    });
  }
}
