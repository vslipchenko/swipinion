import {Directive, HostListener, Input} from '@angular/core';
import {Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {HeaderService} from '~app/services/header/header.service';
import {UserRole} from '~app/typings/user/user.enums';
import {isPlainObject} from 'lodash-es';
import {AuthClickConfiguration, AuthClickMethod} from '~app/typings/auth-click/auth-click.types';

@Directive({
  selector: '[appAuthClick]',
  standalone: true,
})
export class AuthClickDirective {
  @Input() public appAuthClick!: AuthClickMethod | AuthClickConfiguration;

  private unauthenticatedClickCount = 0;

  public constructor(private readonly store: Store, private readonly headerService: HeaderService) {}

  @HostListener('click')
  private guardClick(): void {
    const role = this.store.selectSnapshot(AppSelectors.userRole);

    if (role === UserRole.Guest) {
      if (isPlainObject(this.appAuthClick)) {
        // Assume AuthClickConfiguration
        this.unauthenticatedClickCount += 1;
        // Allow clicks until limit is reached
        if (
          this.unauthenticatedClickCount <= (this.appAuthClick as AuthClickConfiguration).allowUnauthenticatedClickCount
        ) {
          return (this.appAuthClick as AuthClickConfiguration).method();
        }
      }

      return this.headerService.signIn$.next();
    }

    (this.appAuthClick as AuthClickConfiguration).method
      ? (this.appAuthClick as AuthClickConfiguration).method()
      : (this.appAuthClick as AuthClickMethod)();
  }
}
