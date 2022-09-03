import {Router, UrlTree} from '@angular/router';
import {USERNAME_REGEXP} from '~app/constants/validation';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {Store} from '@ngxs/store';
import {Injectable} from '@angular/core';

@Injectable()
export class UserGuardBase {
  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  public canLoadAndActivate(explicitUserLinkNavigation: boolean, username: string): boolean | UrlTree {
    if (explicitUserLinkNavigation) {
      const validUsername = USERNAME_REGEXP.test(username);

      if (!validUsername) {
        void this.router.navigateByUrl('**', {skipLocationChange: true}); // createUrlTree unfortunately does not support skipLocationChange parameter
        return false;
      }

      const profile = this.store.selectSnapshot(AppSelectors.userEssentials);
      // Redirect to profile
      if (username === profile.username) return this.router.createUrlTree(['/profile']);
    } else {
      if (!this.authenticationService.authenticated) return this.router.createUrlTree(['/sign-in']);
    }

    return true;
  }
}
