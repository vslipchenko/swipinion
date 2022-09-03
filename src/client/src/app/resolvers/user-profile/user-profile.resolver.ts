import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Observable, of, switchMap, tap} from 'rxjs';
import {ProfileService} from '~app/services/profile/profile.service';
import {Store} from '@ngxs/store';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {SetUserSettings, UpdateResolvedUserData} from '~app/modules/user/store/user.actions';
import {UserSettingsService} from '~app/services/user-settings/user-settings.service';
import {ApolloQueryResult} from '@apollo/client/core';
import {GetUserSettingsQueryResult} from '~app/typings/user-settings/user-settings.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserProfileResolver implements Resolve<unknown> {
  public constructor(
    private readonly profileService: ProfileService,
    private readonly userSettingsService: UserSettingsService,
    private readonly store: Store,
    private readonly router: Router,
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<unknown> {
    const profile = this.store.selectSnapshot(AppSelectors.userEssentials);
    const navigatingProfile = route.url.some((item) => item.path === 'profile');
    const username = navigatingProfile ? profile.username : route.params['username'];

    const query = navigatingProfile
      ? this.profileService.getProfileData() // Assume user authed and querying own profile data
      : this.profileService.getProfileData(username);

    return query.pipe(
      switchMap(({data}) => {
        if (!data?.userProfile) {
          // User was not found, redirect 404
          void this.router.navigate(['**'], {skipLocationChange: true});
          return of({} as ApolloQueryResult<GetUserSettingsQueryResult>);
        }

        // TODO consider possibility to redirect /user/:currently-signed-in-username to /profile in order to avoid awkward behaviour

        this.store.dispatch(
          // TODO update based on navigatingProfile condition
          new UpdateResolvedUserData({
            id: data.userProfile.id,
            username,
            bio: data.userProfile.bio,
            thumbnail: data.userProfile.thumbnail, // TODO might be a room for a small improvement; can be excluded from querying as it might be present for the /profile route
            isProfilePath: navigatingProfile,
            following: Boolean(data.userProfile.follower_id),
            pending: data.userProfile.pending,
          }),
        );

        return navigatingProfile
          ? of({} as ApolloQueryResult<GetUserSettingsQueryResult>) // This case is handled by profile settings resolver
          : this.userSettingsService.getUserSettings(data.userProfile.id);
      }),
      tap(({data}: ApolloQueryResult<GetUserSettingsQueryResult>) => {
        if (!data?.userSettings) return; // Assume user settings double-checked following server side processing

        this.store.dispatch(new SetUserSettings(data.userSettings));
      }),
    );
  }
}
