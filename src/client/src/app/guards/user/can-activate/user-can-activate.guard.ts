import {ActivatedRouteSnapshot, CanActivate, UrlTree} from '@angular/router';
import {UserGuardBase} from '~app/guards/user/user-guard';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserCanActivateGuard extends UserGuardBase implements CanActivate {
  public canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    return this.canLoadAndActivate(Boolean(route.params['username']), route.params['username']);
  }
}
