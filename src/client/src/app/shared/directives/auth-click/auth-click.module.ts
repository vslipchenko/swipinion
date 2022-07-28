import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthClickDirective} from '~app/shared/directives/auth-click/auth-click.directive';

@NgModule({
  declarations: [AuthClickDirective],
  imports: [CommonModule],
  exports: [AuthClickDirective],
})
export class AuthClickModule {}
