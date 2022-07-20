import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, UrlTree} from '@angular/router';
import {USERNAME_REGEXP} from '~app/constants/validation';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Store} from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})
export class UserCanActivateGuard implements CanActivate {
  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  public canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const explicitUserLinkNavigation = Boolean(route.params['username']);

    if (explicitUserLinkNavigation) {
      const validUsername = USERNAME_REGEXP.test(route.params['username']);

      if (!validUsername) {
        void this.router.navigateByUrl('**', {skipLocationChange: true}); // createUrlTree unfortunately does not support skipLocationChange parameter
        return false;
      }

      const profile = this.store.selectSnapshot(AppSelectors.authedUserProfileTeaser);
      // Redirect to profile
      if (route.params['username'] === profile.username) return this.router.createUrlTree(['/profile']);
    } else {
      if (!this.authenticationService.authenticated) return this.router.createUrlTree(['/sign-in']);
    }

    return true;
  }
}
