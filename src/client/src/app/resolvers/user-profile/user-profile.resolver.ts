import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {ProfileService} from '~app/services/profile/profile.service';
import {Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UpdateResolvedUserData} from '~app/modules/user/store/user.actions';
import {MutationResult} from 'apollo-angular';
import {GetProfileDataQueryResult} from '~app/typings/profile/profile.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserProfileResolver implements Resolve<MutationResult<GetProfileDataQueryResult>> {
  public constructor(
    private readonly profileService: ProfileService,
    private readonly store: Store,
    private readonly router: Router,
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<MutationResult<GetProfileDataQueryResult>> {
    const profile = this.store.selectSnapshot(AppSelectors.authedUserProfileTeaser);
    const navigatingProfile = route.url.some((item) => item.path === 'profile');

    const username = navigatingProfile ? profile.username : route.params['username'];

    return this.profileService.getProfileData(username).pipe(
      // Query is cached
      tap(({data}) => {
        if (!data?.userProfile) {
          // User was not found, redirect 404
          void this.router.navigate(['**'], {skipLocationChange: true});
          return;
        }

        // TODO consider possibility to redirect /user/:currently-signed-in-username to /profile in order to avoid awkward behaviour

        this.store.dispatch(
          new UpdateResolvedUserData({
            id: data.userProfile.id,
            username,
            bio: data.userProfile.bio,
            thumbnail: data.userProfile.thumbnail, // TODO might be a room for a small improvement; can be excluded from querying as it might be present for the /profile route
            isProfilePath: navigatingProfile,
            following: Boolean(data.userProfile.follower_id),
          }),
        );
      }),
    );
  }
}
