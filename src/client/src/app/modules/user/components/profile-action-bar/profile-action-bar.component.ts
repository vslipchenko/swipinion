import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {UserRole} from '~app/typings/user/user.enums';
import {BehaviorSubject} from 'rxjs';
import {Store} from '@ngxs/store';
import {FollowUser} from '~app/modules/user/store/user.actions';

@Component({
  selector: 'app-profile-action-bar',
  templateUrl: './profile-action-bar.component.html',
  styleUrls: ['./profile-action-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileActionBarComponent {
  @Input() public role = UserRole.Guest;
  @Input() public username = '';
  @Input() public thumbnail = '';
  @Input() public showBottomBar = false;
  @Input() public wrapper!: HTMLDivElement;

  public readonly loading$ = new BehaviorSubject(false);
  public readonly userRole = UserRole;

  public constructor(private readonly store: Store) {}

  public message(): void {
    console.log('message');
  }

  public follow(): void {
    this.store.dispatch(new FollowUser({username: this.username, thumbnail: this.thumbnail}));
  }

  public scrollTop(): void {
    this.wrapper.scrollTo({top: 0, behavior: 'smooth'});
  }
}
