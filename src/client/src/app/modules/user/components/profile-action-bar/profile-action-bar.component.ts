import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Select} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Observable} from 'rxjs';
import {UserRole} from '~app/typings/user/user.enums';

@Component({
  selector: 'app-profile-action-bar',
  templateUrl: './profile-action-bar.component.html',
  styleUrls: ['./profile-action-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileActionBarComponent {
  @Select(AppSelectors.userRole)
  public readonly role$!: Observable<UserRole>;

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
