import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {SEND_USER_MESSAGE} from '~app/graphql/user-messages/user-messages.mutations';
import {SendUserMessage, SendUserMessageMutationResult} from '~app/typings/user-messages/user-messages.interfaces';
import {CheckUnreadUserMessageQueryResult} from '~app/typings/opinion/opinion.interfaces';
import {CHECK_UNREAD_USER_MESSAGE_EXISTS} from '~app/graphql/user-messages/user-messages.queries';
import {ApolloQueryResult} from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class UserMessagesService {
  public constructor(private readonly apollo: Apollo) {}

  public sendMessage(input: SendUserMessage): Observable<MutationResult<SendUserMessageMutationResult>> {
    return this.apollo.mutate<SendUserMessageMutationResult>({
      mutation: SEND_USER_MESSAGE,
      variables: {input},
    });
  }

  public checkUnreadMessageExists(): Observable<ApolloQueryResult<CheckUnreadUserMessageQueryResult>> {
    return this.apollo.query<CheckUnreadUserMessageQueryResult>({
      query: CHECK_UNREAD_USER_MESSAGE_EXISTS,
    });
  }
}
