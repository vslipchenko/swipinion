import {ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {
  LegacyMenuPositionX as MenuPositionX,
  MatLegacyMenuModule as MatMenuModule,
  MatLegacyMenuPanel as MatMenuPanel,
} from '@angular/material/legacy-menu';
import {MenuItem} from '~app/typings/menu/menu.interfaces';
import {ProgressSpinnerComponent} from '~app/shared/components/progress-spinner/progress-spinner.component';
import {NgForOf, NgIf} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgForOf, RouterLinkActive, RouterLink, MatMenuModule, ProgressSpinnerComponent, MatIconModule],
})
export class MenuItemsComponent {
  @Input() public items: Array<MenuItem> = [];
  @Input() public xPosition: MenuPositionX = 'before';
  @Input() public loading = false;
  @Input() public context: any;

  @ViewChild('menu', {static: true}) public menu?: MatMenuPanel;
}
