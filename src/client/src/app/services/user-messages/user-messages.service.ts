import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {SEND_USER_MESSAGE} from '~app/graphql/user-messages/user-messages.mutations';
import {
  FetchUserChatPayload,
  FetchUserChatQueryResult,
  FetchUserMessagesQueryResult,
  SendUserMessage,
  SendUserMessageMutationResult,
} from '~app/typings/user-messages/user-messages.interfaces';
import {ApolloQueryResult} from '@apollo/client/core';
import {FETCH_USER_CHAT, FETCH_USER_MESSAGES} from '~app/graphql/user-messages/user-messages.queries';

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

  public fetchUserMessages(edgeId?: string): Observable<ApolloQueryResult<FetchUserMessagesQueryResult>> {
    return this.apollo.query<FetchUserMessagesQueryResult>({
      query: FETCH_USER_MESSAGES,
      variables: {edgeId},
      fetchPolicy: 'no-cache',
    });
  }

  public fetchUserChat(input: FetchUserChatPayload): Observable<ApolloQueryResult<FetchUserChatQueryResult>> {
    return this.apollo.query<FetchUserChatQueryResult>({
      query: FETCH_USER_CHAT,
      variables: {input},
      fetchPolicy: 'no-cache',
    });
  }
}
