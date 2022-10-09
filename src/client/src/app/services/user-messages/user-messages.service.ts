import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {SEND_USER_MESSAGE, SEND_USER_SAVED_MESSAGE} from '~app/graphql/user-messages/user-messages.mutations';
import {
  CheckConversationMessageStatusQueryResult,
  FetchNewUserMessagesQueryResult,
  FetchUserConversationPayload,
  FetchUserConversationQueryResult,
  FetchUserMessagesQueryResult,
  FetchUserSavedMessagesQueryResult,
  SendUserMessage,
  SendUserMessageMutationResult,
  SendUserSavedMessageMutationResult,
} from '~app/typings/user-messages/user-messages.interfaces';
import {ApolloQueryResult} from '@apollo/client/core';
import {
  CHECK_CONVERSATION_MESSAGE_STATUS,
  FETCH_NEW_USER_MESSAGES,
  FETCH_USER_CONVERSATION,
  FETCH_USER_MESSAGES,
  FETCH_USER_SAVED_MESSAGES,
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

  public sendSavedMessage(input: string): Observable<MutationResult<SendUserSavedMessageMutationResult>> {
    return this.apollo.mutate<SendUserSavedMessageMutationResult>({
      mutation: SEND_USER_SAVED_MESSAGE,
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

  public fetchUserSavedMessages(edgeId?: string): Observable<ApolloQueryResult<FetchUserSavedMessagesQueryResult>> {
    return this.apollo.query<FetchUserSavedMessagesQueryResult>({
      query: FETCH_USER_SAVED_MESSAGES,
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

  public checkConversationMessageStatus(
    input: string,
  ): Observable<ApolloQueryResult<CheckConversationMessageStatusQueryResult>> {
    return this.apollo.query<CheckConversationMessageStatusQueryResult>({
      query: CHECK_CONVERSATION_MESSAGE_STATUS,
      variables: {input},
      fetchPolicy: 'no-cache',
    });
  }
}
