import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UpdateUserRole} from '~app/modules/app/store/app.actions';
import {UserRole} from '~app/typings/user/user.enums';

@Injectable({
  providedIn: 'root',
})
export class UserRoleResolver implements Resolve<boolean> {
  public constructor(private readonly store: Store) {}

  public resolve(route: ActivatedRouteSnapshot): boolean {
    if (route.routeConfig?.path === 'profile') {
      this.store.dispatch(new UpdateUserRole(UserRole.User));
      return true;
    }

    const {username} = this.store.selectSnapshot(AppSelectors.authedUserProfileTeaser);

    if (!username) {
      this.store.dispatch(new UpdateUserRole(UserRole.Guest));
      return true;
    }

    const urlUsername = route.params['username'];

    if (urlUsername === username) {
      this.store.dispatch(new UpdateUserRole(UserRole.User));
      return true;
    }

    this.store.dispatch(new UpdateUserRole(UserRole.Viewer));
    return true;
  }
}
