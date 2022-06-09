import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {MatTabHeaderPosition} from '@angular/material/tabs/tab-group';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  @Input() public color: ThemePalette;
  @Input() public tabs: Array<string> = [];
  @Input() public headerPosition: MatTabHeaderPosition = 'above';
  // @Input() public flipBars = false;
}
