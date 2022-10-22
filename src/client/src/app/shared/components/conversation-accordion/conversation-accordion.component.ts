import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-conversation-accordion',
  templateUrl: './conversation-accordion.component.html',
  styleUrls: ['./conversation-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationAccordionComponent implements OnInit {
  @Input() public activeConversation = '';

  constructor() {}

  ngOnInit(): void {}
}
