import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
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
  // @Input() public flipBars = false;
}
