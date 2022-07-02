import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {map, Observable} from 'rxjs';
import {ProfileService} from '~app/services/profile/profile.service';
import {Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UserProfile} from '~app/typings/user/user.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserProfileResolver implements Resolve<UserProfile> {
  public constructor(
    private readonly profileService: ProfileService,
    private readonly store: Store,
    private readonly router: Router,
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<UserProfile> {
    const profile = this.store.selectSnapshot(AppSelectors.userProfile);
    const navigatingProfile = route.routeConfig?.path === 'profile';
    const username = navigatingProfile ? profile.username : route.params['username'];

    return this.profileService.getProfileData(username).pipe(
      // Query is cached
      map(({data}) => {
        if (!data?.userProfile) {
          // User was not found, redirect 404
          void this.router.navigate(['**'], {skipLocationChange: true});
          return {} as UserProfile;
        }

        return {
          username,
          bio: data.userProfile.bio,
          thumbnail: data.userProfile.thumbnail, // TODO might be a room for a small improvement; can be excluded from querying as it might be present for the /profile route
          isProfilePath: navigatingProfile,
        };
      }),
    );
  }
}
