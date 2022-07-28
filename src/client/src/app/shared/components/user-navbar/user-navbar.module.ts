import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserNavbarComponent} from '~app/shared/components/user-navbar/user-navbar.component';
import {MenuItemsModule} from '~app/shared/components/menu-items/menu-items.module';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [UserNavbarComponent],
  imports: [CommonModule, MenuItemsModule, MatMenuModule],
  exports: [UserNavbarComponent],
})
export class UserNavbarModule {}
