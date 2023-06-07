import {Injector} from '@angular/core';
import {Store} from '@ngxs/store';
import {HeaderService} from '~app/services/header/header.service';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UserRole} from '~app/typings/user/user.enums';
import {isPlainObject} from 'lodash-es';
import {AuthClickConfiguration, AuthClickMethod} from '~app/typings/auth-click/auth-click.types';

export const authClickGuard = (payload: AuthClickMethod | AuthClickConfiguration, injector: Injector): (() => void) => {
  let unauthenticatedClickCount = 0;

  return (): void => {
    {
      const store = injector.get(Store);
      const headerService = injector.get(HeaderService);

      const role = store.selectSnapshot(AppSelectors.userRole);

      if (role === UserRole.Guest) {
        if (isPlainObject(payload)) {
          // Assume AuthClickConfiguration
          unauthenticatedClickCount += 1;
          // Allow clicks until limit is reached
          if (unauthenticatedClickCount <= (payload as AuthClickConfiguration).allowUnauthenticatedClickCount) {
            return (payload as AuthClickConfiguration).method();
          }
        }

        return headerService.signIn$.next();
      }

      (payload as AuthClickConfiguration).method
        ? (payload as AuthClickConfiguration).method()
        : (payload as AuthClickMethod)();
    }
  };
};
