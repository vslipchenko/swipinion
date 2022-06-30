import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile-action-bar',
  templateUrl: './profile-action-bar.component.html',
  styleUrls: ['./profile-action-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileActionBarComponent {
  @Input() public showBottomBar = false;
  @Input() public wrapper!: HTMLDivElement;

  public message(): void {}

  public follow(): void {
    console.log('follow');
  }

  public scrollTop(): void {
    this.wrapper.scrollTo({top: 0, behavior: 'smooth'});
  }
}
