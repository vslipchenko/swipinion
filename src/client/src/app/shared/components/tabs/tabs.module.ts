import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabsComponent} from '~app/shared/components/tabs/tabs.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [TabsComponent],
  imports: [CommonModule, MatTabsModule, MatIconModule],
  exports: [TabsComponent],
})
export class TabsModule {}
