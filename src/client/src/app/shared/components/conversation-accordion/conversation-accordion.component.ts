import {AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {AccordionComponent} from '~app/shared/components/accordion/accordion.component';

@Component({
  selector: 'app-conversation-accordion',
  templateUrl: './conversation-accordion.component.html',
  styleUrls: ['./conversation-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationAccordionComponent implements AfterViewInit {
  @Input() public activeConversation = '';
  @ViewChild(AccordionComponent, {static: true}) private readonly accordionComponent!: AccordionComponent;

  public ngAfterViewInit(): void {
    this.expandAccordion();
  }

  public expandAccordion(): void {
    this.accordionComponent.accordion.openAll();
  }
}
