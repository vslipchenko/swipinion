import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
  @Input() public panelTitle?: TemplateRef<any>;
  @Input() public panelDescription?: TemplateRef<any>;
  @Input() public content?: TemplateRef<any>;
  @Input() public hideToggle = false;
  @Input() public extendClass = '';
}
