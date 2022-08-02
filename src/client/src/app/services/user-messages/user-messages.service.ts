import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {SEND_USER_MESSAGE} from '~app/graphql/user-messages/user-messages.mutations';
import {SendUserMessage, SendUserMessageMutationResult} from '~app/typings/user-messages/user-messages.interfaces';
import {ApolloQueryResult} from '@apollo/client/core';
import {FETCH_USER_MESSAGES} from '~app/graphql/user-messages/user-messages.queries';

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

  public fetchUserMessages(startDate?: string): Observable<ApolloQueryResult<unknown>> {
    return this.apollo.query<unknown>({
      query: FETCH_USER_MESSAGES,
      variables: {startDate},
      fetchPolicy: 'no-cache',
    });
  }
}
