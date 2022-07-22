import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-favorites-tab',
  templateUrl: './user-favorites-tab.component.html',
  styleUrls: ['./user-favorites-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFavoritesTabComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
