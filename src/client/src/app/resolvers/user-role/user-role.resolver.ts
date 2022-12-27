import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UpdateUserRole} from '~app/modules/app/store/app.actions';
import {UserRole} from '~app/typings/user/user.enums';

@Injectable({
  providedIn: 'root',
})
export class UserRoleResolver implements Resolve<void> {
  public constructor(private readonly store: Store) {}

  public resolve(route: ActivatedRouteSnapshot): void {
    const navigatingProfile = route.url.some((item) => item.path === 'profile');

    if (navigatingProfile) {
      this.store.dispatch(new UpdateUserRole(UserRole.User));
      return;
    }

    const {username} = this.store.selectSnapshot(AppSelectors.userEssentials);

    if (!username) {
      this.store.dispatch(new UpdateUserRole(UserRole.Guest));
      return;
    }

    const urlUsername = route.params['username'];

    if (urlUsername === username) {
      this.store.dispatch(new UpdateUserRole(UserRole.User));
      return;
    }

    this.store.dispatch(new UpdateUserRole(UserRole.Viewer));
  }
}
