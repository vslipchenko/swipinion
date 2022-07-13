import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AccordionComponent} from '~app/shared/components/accordion/accordion.component';

@Component({
  selector: 'app-settings-accordion',
  templateUrl: './settings-accordion.component.html',
  styleUrls: ['./settings-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccordionComponent {
  @Input() public content!: TemplateRef<any>;
  @Input() public icon = '';
  @Input() public title = '';
  @Input() public form = new FormGroup({});
  @Input() public showActions = true;
  @Input() public loading = false;

  @Output() public closed = new EventEmitter();
  @Output() public save = new EventEmitter();

  @ViewChild(AccordionComponent) public accordion?: AccordionComponent;

  public cancel(): void {
    this.accordion?.panel?.close();
    this.closed.emit();
  }
}
