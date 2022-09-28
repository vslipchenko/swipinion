import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {SEND_USER_MESSAGE} from '~app/graphql/user-messages/user-messages.mutations';
import {
  CheckConversationMessageSeenStatusQueryResult,
  FetchNewUserMessagesQueryResult,
  FetchUserConversationPayload,
  FetchUserConversationQueryResult,
  FetchUserMessagesQueryResult,
  SendUserMessage,
  SendUserMessageMutationResult,
} from '~app/typings/user-messages/user-messages.interfaces';
import {ApolloQueryResult} from '@apollo/client/core';
import {
  CHECK_CONVERSATION_MESSAGE_SEEN_STATUS,
  FETCH_NEW_USER_MESSAGES,
  FETCH_USER_CONVERSATION,
  FETCH_USER_MESSAGES,
} from '~app/graphql/user-messages/user-messages.queries';

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

  public fetchNewUserMessages(input: Array<string>): Observable<ApolloQueryResult<FetchNewUserMessagesQueryResult>> {
    return this.apollo.query<FetchNewUserMessagesQueryResult>({
      query: FETCH_NEW_USER_MESSAGES,
      variables: {input},
      fetchPolicy: 'no-cache',
    });
  }

  public fetchUserConversation(
    input: FetchUserConversationPayload,
  ): Observable<ApolloQueryResult<FetchUserConversationQueryResult>> {
    return this.apollo.query<FetchUserConversationQueryResult>({
      query: FETCH_USER_CONVERSATION,
      variables: {input},
      fetchPolicy: 'no-cache',
    });
  }

  public checkConversationMessageSeenStatus(
    input: string,
  ): Observable<ApolloQueryResult<CheckConversationMessageSeenStatusQueryResult>> {
    return this.apollo.query<CheckConversationMessageSeenStatusQueryResult>({
      query: CHECK_CONVERSATION_MESSAGE_SEEN_STATUS,
      variables: {input},
      fetchPolicy: 'no-cache',
    });
  }
}
