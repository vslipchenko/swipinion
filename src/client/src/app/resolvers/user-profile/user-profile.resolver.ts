import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileResolver implements Resolve<boolean> {
  public resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (route.routeConfig?.path === 'profile') return of(true); // Data is already present partially

    return of(true);
  }
}
