import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabsComponent} from '~app/shared/components/tabs/tabs.component';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [TabsComponent],
  imports: [CommonModule, MatTabsModule, MatIconModule],
  exports: [TabsComponent],
})
export class TabsModule {}
