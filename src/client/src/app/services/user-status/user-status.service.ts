import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {CheckUserStatusQueryResult} from '~app/typings/opinion/opinion.interfaces';
import {ApolloQueryResult} from '@apollo/client/core';
import {CHECK_USER_STATUS} from '~app/graphql/user-status/user-status.queries';

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  public constructor(private readonly apollo: Apollo) {}

  public checkUserStatus(): Observable<ApolloQueryResult<CheckUserStatusQueryResult>> {
    return this.apollo.query<CheckUserStatusQueryResult>({
      query: CHECK_USER_STATUS,
    });
  }
}
