import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from '~app/shared/components/header/header.component';
import {ButtonModule} from '~app/shared/components/button/button.module';
import {FlatButtonModule} from '~app/shared/components/flat-button/flat-button.module';
import {UserNavbarModule} from '~app/shared/components/user-navbar/user-navbar.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, ButtonModule, FlatButtonModule, UserNavbarModule, RouterModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
