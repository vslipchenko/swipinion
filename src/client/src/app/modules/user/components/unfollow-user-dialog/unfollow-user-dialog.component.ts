import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-unfollow-user-dialog',
  templateUrl: './unfollow-user-dialog.component.html',
  styleUrls: ['./unfollow-user-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnfollowUserDialogComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
