import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment, UrlTree} from '@angular/router';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {USERNAME_REGEXP} from '~app/constants/validation';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Store} from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})
export class UserCanLoadGuard implements CanLoad {
  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  public canLoad(route: Route, segments: Array<UrlSegment>): boolean | UrlTree {
    const explicitUserLinkNavigation = segments[0].path === 'user';

    if (explicitUserLinkNavigation) {
      const validUsername = USERNAME_REGEXP.test(segments[1].path);

      if (!validUsername) {
        void this.router.navigateByUrl('**', {skipLocationChange: true}); // createUrlTree unfortunately does not support skipLocationChange parameter
        return false;
      }

      const profile = this.store.selectSnapshot(AppSelectors.authedUserProfileTeaser);
      // Redirect to profile
      if (segments[1].path === profile.username) return this.router.createUrlTree(['/profile']);
    } else {
      if (!this.authenticationService.authenticated) return this.router.createUrlTree(['/sign-in']);
    }

    return true;
  }
}
