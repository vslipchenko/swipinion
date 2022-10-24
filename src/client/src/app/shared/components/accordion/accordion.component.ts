import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {MatExpansionPanel} from '@angular/material/expansion';

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
  @Input() public titleClass = '';
  @Input() public hideToggle = false;

  @Output() public afterExpand = new EventEmitter<void>();
  @Output() public afterCollapse = new EventEmitter<void>();

  @ViewChild(MatExpansionPanel, {static: true}) public panel!: MatExpansionPanel;
}
