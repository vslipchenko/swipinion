import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {MatTabChangeEvent, MatTabHeaderPosition} from '@angular/material/tabs/tab-group';
import {Tab} from '~app/typings/tabs/tabs.interfaces';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  // providers: [{provide: ANIMATION_MODULE_TYPE, useValue: 'NoopAnimations'}],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  @Input() public color: ThemePalette;
  @Input() public tabs: Array<Tab> = [];
  @Input() public headerPosition: MatTabHeaderPosition = 'above';

  @Output() public selectedTabChange = new EventEmitter<MatTabChangeEvent>();
  // @Input() public flipBars = false;
}
