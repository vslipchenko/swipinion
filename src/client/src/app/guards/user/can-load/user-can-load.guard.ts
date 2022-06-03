import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, UrlTree} from '@angular/router';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {USERNAME_REGEXP} from '~app/constants/validation';

@Injectable({
  providedIn: 'root',
})
export class UserCanLoadGuard implements CanActivate {
  public constructor(private readonly authenticationService: AuthenticationService, private readonly router: Router) {}

  public canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const longLinkNavigation = Boolean(route.params['username']);

    if (longLinkNavigation) {
      const validUsername = USERNAME_REGEXP.test(route.params['username']);

      if (!validUsername) {
        void this.router.navigateByUrl('**', {skipLocationChange: true}); // createUrlTree unfortunately does not support skipLocationChange parameter
        return false;
      }
    } else {
      if (!this.authenticationService.authenticated) return this.router.createUrlTree(['/sign-in']);
    }

    return true;
  }
}
