import {Directive, HostListener, Input} from '@angular/core';
import {Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {HeaderService} from '~app/services/header/header.service';
import {UserRole} from '~app/typings/user/user.enums';

@Directive({
  selector: '[appAuthClick]',
})
export class AuthClickDirective {
  public constructor(private readonly store: Store, private readonly headerService: HeaderService) {}

  @Input() public appAuthClick = (): void => {};

  @HostListener('click')
  private guardClick(): void {
    const role = this.store.selectSnapshot(AppSelectors.userRole);

    if (role === UserRole.Guest) return this.headerService.signIn$.next();

    this.appAuthClick();
  }
}
