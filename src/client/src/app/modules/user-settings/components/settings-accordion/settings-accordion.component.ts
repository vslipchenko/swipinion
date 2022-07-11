import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {FormGroup} from '@angular/forms';

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

  @Output() public save = new EventEmitter();

  public cancel(): void {
    this.form.reset();
  }

  // public save(): void {}
}
