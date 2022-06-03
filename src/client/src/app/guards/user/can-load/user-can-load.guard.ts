import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment, UrlTree} from '@angular/router';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {USERNAME_REGEXP} from '~app/constants/validation';

@Injectable({
  providedIn: 'root',
})
export class UserCanLoadGuard implements CanLoad {
  public constructor(private readonly authenticationService: AuthenticationService, private readonly router: Router) {}

  public canLoad(route: Route, segments: Array<UrlSegment>): boolean | UrlTree {
    const explicitUserLinkNavigation = segments[0].path === 'user';

    if (explicitUserLinkNavigation) {
      const validUsername = USERNAME_REGEXP.test(segments[1].path);

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
