import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-message-dialog',
  templateUrl: './user-message-dialog.component.html',
  styleUrls: ['./user-message-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMessageDialogComponent implements OnInit {
  public constructor() {}

  ngOnInit(): void {}
}
