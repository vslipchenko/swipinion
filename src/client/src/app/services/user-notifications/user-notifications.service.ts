import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {
  DeleteNotificationMutationResult,
  GetUserNotificationsQueryResult,
} from '~app/typings/user-notifications/user-notifications.interfaces';
import {GET_USER_NOTIFICATIONS} from '~app/graphql/user-notifications/user-notifications.queries';
import {DELETE_USER_NOTIFICATION} from '~app/graphql/user-notifications/user-notifications.mutations';
import {ApolloQueryResult} from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class UserNotificationsService {
  public constructor(private readonly apollo: Apollo) {}

  public getNotifications(edgeId?: string): Observable<ApolloQueryResult<GetUserNotificationsQueryResult>> {
    return this.apollo.query<GetUserNotificationsQueryResult>({
      query: GET_USER_NOTIFICATIONS,
      variables: {edgeId},
      fetchPolicy: 'no-cache', // TODO setup proper cache utilization & update mechanism
    });
  }

  public deleteNotification(id: string): Observable<ApolloQueryResult<DeleteNotificationMutationResult>> {
    return this.apollo.query<DeleteNotificationMutationResult>({
      query: DELETE_USER_NOTIFICATION,
      variables: {id},
    });
  }
}
