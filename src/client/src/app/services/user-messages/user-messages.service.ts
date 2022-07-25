import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {SEND_USER_MESSAGE} from '~app/graphql/user-messages/user-messages.mutations';
import {SendUserMessage, SendUserMessageMutationResult} from '~app/typings/user-messages/user-messages.interfaces';

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
}
