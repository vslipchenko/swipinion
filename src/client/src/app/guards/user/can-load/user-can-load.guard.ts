import {Injectable} from '@angular/core';
import {CanLoad, Route, UrlSegment, UrlTree} from '@angular/router';
import {UserGuardBase} from '~app/guards/user/user-guard';

@Injectable({
  providedIn: 'root',
})
export class UserCanLoadGuard extends UserGuardBase implements CanLoad {
  public canLoad(route: Route, segments: Array<UrlSegment>): boolean | UrlTree {
    return this.canLoadAndActivate(segments[0].path === 'user', segments[1]?.path);
  }
}
