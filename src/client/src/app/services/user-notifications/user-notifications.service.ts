import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {
  DeleteNotificationMutationResult,
  GetUserNotificationsQueryResult,
} from '~app/typings/user-notifications/user-notifications.interfaces';
import {GET_USER_NOTIFICATIONS} from '~app/graphql/user-notifications/user-notifications.queries';
import {DELETE_USER_NOTIFICATION} from '~app/graphql/user-notifications/user-notifications.mutations';

@Injectable({
  providedIn: 'root',
})
export class UserNotificationsService {
  public constructor(private readonly apollo: Apollo) {}

  public getNotifications(offset: number): Observable<MutationResult<GetUserNotificationsQueryResult>> {
    return this.apollo.query<GetUserNotificationsQueryResult>({
      query: GET_USER_NOTIFICATIONS,
      variables: {offset},
      fetchPolicy: 'no-cache', // TODO setup proper cache utilization & update mechanism
    });
  }

  public deleteNotification(id: string): Observable<MutationResult<DeleteNotificationMutationResult>> {
    return this.apollo.query<DeleteNotificationMutationResult>({
      query: DELETE_USER_NOTIFICATION,
      variables: {id},
    });
  }
}
