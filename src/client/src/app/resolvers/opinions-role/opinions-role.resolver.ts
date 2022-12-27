import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {UpdateUserRole} from '~app/modules/app/store/app.actions';
import {UserRole} from '~app/typings/user/user.enums';
import {Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';

@Injectable({
  providedIn: 'root',
})
export class OpinionsRoleResolver implements Resolve<void> {
  public constructor(private readonly store: Store) {}

  // Guest role corresponds to viewing other user opinions
  // Viewer role corresponds to viewing opinions of others
  // User role corresponds to viewing own opinions
  public resolve(route: ActivatedRouteSnapshot): void {
    const {username} = this.store.selectSnapshot(AppSelectors.userEssentials);

    if (!username) {
      this.store.dispatch(new UpdateUserRole(UserRole.Viewer));
      return;
    }

    const urlUsername = route.params['username'];

    if (!urlUsername) {
      this.store.dispatch(new UpdateUserRole(UserRole.Viewer));
      return;
    }

    if (urlUsername === username) {
      this.store.dispatch(new UpdateUserRole(UserRole.User));
    } else {
      this.store.dispatch(new UpdateUserRole(UserRole.Guest));
    }

    return;
  }
}
