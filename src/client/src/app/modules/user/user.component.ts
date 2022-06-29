import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {FetchUserOpinions} from '~app/modules/user/store/user.actions';
import {Observable, of} from 'rxjs';
import {Opinion} from '~app/typings/opinion/opinion.interfaces';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {MatDialog} from '@angular/material/dialog';
import {EditProfileDialogComponent} from '~app/modules/user/components/edit-profile-dialog/edit-profile-dialog.component';
import {UserProfile} from '~app/typings/user/user.interfaces';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  @Select(UserSelectors.opinions) public readonly opinions$!: Observable<Array<Opinion>>;
  public readonly userProfile$: Observable<UserProfile>;

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
  ) {
    // console.log(this.route.snapshot.data);
    this.userProfile$ = of(this.route.snapshot.data['profile']);
  }

  public ngOnInit(): void {
    console.log(this.route.snapshot.data);
    this.store.dispatch(
      new FetchUserOpinions({
        username: this.route.snapshot.data['profile']['username'],
        offset: 0,
      }),
    );
  }

  public openEditProfile(): void {
    this.dialog.open(EditProfileDialogComponent, {panelClass: ['dialog', 'extended-dialog']});
  }
}
