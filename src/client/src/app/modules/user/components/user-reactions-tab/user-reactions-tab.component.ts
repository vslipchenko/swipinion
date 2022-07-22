import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-reactions-tab',
  templateUrl: './user-reactions-tab.component.html',
  styleUrls: ['./user-reactions-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserReactionsTabComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
