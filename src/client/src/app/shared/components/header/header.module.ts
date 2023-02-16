import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from '~app/shared/components/header/header.component';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {FlatButtonComponent} from '~app/shared/components/flat-button/flat-button.component';
import {UserNavbarModule} from '~app/shared/components/user-navbar/user-navbar.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, ButtonComponent, FlatButtonComponent, UserNavbarModule, RouterModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
