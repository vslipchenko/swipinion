import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMessagesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
