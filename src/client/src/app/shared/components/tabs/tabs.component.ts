import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {Tab} from '~app/typings/tabs/tabs.interfaces';
import {
  MatLegacyTabChangeEvent as MatTabChangeEvent,
  MatLegacyTabHeaderPosition as MatTabHeaderPosition,
  MatLegacyTabsModule as MatTabsModule,
} from '@angular/material/legacy-tabs';
import {NgForOf, NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  // providers: [{provide: ANIMATION_MODULE_TYPE, useValue: 'NoopAnimations'}],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgForOf, NgIf, MatTabsModule, MatIconModule],
})
export class TabsComponent {
  @Input() public color: ThemePalette;
  @Input() public tabs: Array<Tab> = [];
  @Input() public headerPosition: MatTabHeaderPosition = 'above';

  @Output() public selectedTabChange = new EventEmitter<MatTabChangeEvent>();
  // @Input() public flipBars = false;
}
