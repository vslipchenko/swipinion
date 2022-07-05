import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-unfollow-user-dialog',
  templateUrl: './unfollow-user-dialog.component.html',
  styleUrls: ['./unfollow-user-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnfollowUserDialogComponent {
  @Output() public unfollow = new EventEmitter();

  public readonly loading$ = new BehaviorSubject(false);
}
