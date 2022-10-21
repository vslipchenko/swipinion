import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-messages-panel',
  templateUrl: './messages-panel.component.html',
  styleUrls: ['./messages-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesPanelComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
