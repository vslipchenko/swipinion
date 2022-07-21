import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {MatTabHeaderPosition} from '@angular/material/tabs/tab-group';
import {Tab} from '~app/typings/tabs/tabs.interfaces';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  @Input() public color: ThemePalette;
  @Input() public tabs: Array<Tab> = [];
  @Input() public headerPosition: MatTabHeaderPosition = 'above';

  @Output() public clicked = new EventEmitter<Tab>();
  // @Input() public flipBars = false;
}
