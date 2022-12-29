import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {UpdateUserRole} from '~app/modules/app/store/app.actions';
import {UserRole} from '~app/typings/user/user.enums';
import {Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {OpinionsView} from '~app/typings/opinion/opinion.enums';

@Injectable({
  providedIn: 'root',
})
export class OpinionsViewResolver implements Resolve<OpinionsView> {
  public constructor(private readonly store: Store) {}

  // Guest role corresponds to unauthed used
  // Viewer role corresponds to viewing opinions of others
  // User role corresponds to own opinion view
  public resolve(route: ActivatedRouteSnapshot): OpinionsView {
    const {username} = this.store.selectSnapshot(AppSelectors.userEssentials);
    const urlUsername = route.params['username'];

    if (!urlUsername) {
      this.store.dispatch(new UpdateUserRole(username ? UserRole.Viewer : UserRole.Guest));
      return OpinionsView.General;
    }

    if (urlUsername === username) {
      this.store.dispatch(new UpdateUserRole(UserRole.User));
    } else {
      this.store.dispatch(new UpdateUserRole(username ? UserRole.Viewer : UserRole.Guest));
    }

    return OpinionsView.Individual;
  }
}
