import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {UserRole} from '~app/typings/user/user.enums';

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

  public readonly userRole = UserRole;

  public message(): void {
    console.log('message');
  }

  public follow(): void {
    console.log('follow');
  }

  public scrollTop(): void {
    this.wrapper.scrollTo({top: 0, behavior: 'smooth'});
  }
}
