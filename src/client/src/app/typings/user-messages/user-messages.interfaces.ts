import {SuccessResponse} from '~app/typings/response/response.interfaces';

export interface SendUserMessage {
  receiverId: string;
  body: string;
}

export interface SendUserMessageMutationResult {
  sendUserMessage: SuccessResponse;
}

export interface FetchUserMessagesQueryResult {
  fetchUserMessages: Array<UserMessage>;
}

export interface UserMessage {
  id: string;
  sender_id: string;
  username: string;
  thumbnail: string;
  body: string;
  read: boolean;
  created_at: number;
}
