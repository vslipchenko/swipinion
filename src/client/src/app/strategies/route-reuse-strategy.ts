import {ActivatedRouteSnapshot, BaseRouteReuseStrategy} from '@angular/router';

export class CustomRouteReuseStrategy extends BaseRouteReuseStrategy {
  public override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.data['disableRouteReuse'] ? false : super.shouldReuseRoute(future, curr);
  }
}
