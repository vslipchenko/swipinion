import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuItemsComponent} from '~app/shared/components/menu-items/menu-items.component';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {ProgressSpinnerModule} from '~app/shared/components/progress-spinner/progress-spinner.module';

@NgModule({
  declarations: [MenuItemsComponent],
  imports: [CommonModule, MatMenuModule, MatIconModule, RouterModule, ProgressSpinnerModule],
  exports: [MenuItemsComponent],
})
export class MenuItemsModule {}
