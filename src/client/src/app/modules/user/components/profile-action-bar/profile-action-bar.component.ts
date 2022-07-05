import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {UserRole} from '~app/typings/user/user.enums';
import {BehaviorSubject, Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {FollowUser} from '~app/modules/user/store/user.actions';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {MatDialog} from '@angular/material/dialog';
import {UnfollowUserDialogComponent} from '~app/modules/user/components/unfollow-user-dialog/unfollow-user-dialog.component';

@Component({
  selector: 'app-profile-action-bar',
  templateUrl: './profile-action-bar.component.html',
  styleUrls: ['./profile-action-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileActionBarComponent {
  @Input() public role = UserRole.Guest;
  @Input() public id = '';
  @Input() public username = '';
  @Input() public thumbnail = '';
  @Input() public showBottomBar = false;
  @Input() public wrapper!: HTMLDivElement;

  @Select(UserSelectors.following) public following$!: Observable<boolean>;

  public readonly loading$ = new BehaviorSubject(false);
  public readonly userRole = UserRole;

  public constructor(private readonly store: Store, private readonly dialog: MatDialog) {}

  public message(): void {
    console.log('message');
  }

  public follow(): void {
    this.store.dispatch(new FollowUser(this.id));
  }

  public unfollow(): void {
    // this.store.dispatch(new UnfollowUser(this.id));
    this.dialog.open(UnfollowUserDialogComponent, {panelClass: ['dialog', 'extended-dialog']});
  }

  public scrollTop(): void {
    this.wrapper.scrollTo({top: 0, behavior: 'smooth'});
  }
}
