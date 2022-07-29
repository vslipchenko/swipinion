import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {CheckUnreadUserMessageQueryResult} from '~app/typings/opinion/opinion.interfaces';
import {Observable} from 'rxjs';
import {CHECK_UNREAD_USER_MESSAGE_EXISTS} from '~app/graphql/user-messages/user-messages.queries';

@Injectable({
  providedIn: 'root',
})
export class MessagesPingService {
  public constructor(private readonly apollo: Apollo) {}

  public checkUnreadMessageExists(): Observable<MutationResult<CheckUnreadUserMessageQueryResult>> {
    return this.apollo.query<CheckUnreadUserMessageQueryResult>({
      query: CHECK_UNREAD_USER_MESSAGE_EXISTS,
    });
  }
}
