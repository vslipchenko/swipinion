import {ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {MatMenuPanel, MenuPositionX} from '@angular/material/menu';
import {MenuItem} from '~app/typings/menu/menu.interfaces';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemsComponent {
  @Input() public items: Array<MenuItem> = [];
  @Input() public xPosition: MenuPositionX = 'before';

  @ViewChild('menu', {static: true}) public menu?: MatMenuPanel;
}
