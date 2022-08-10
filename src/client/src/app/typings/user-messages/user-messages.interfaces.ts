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

export interface FetchUserChatQueryResult {
  fetchUserChat: unknown;
}

export interface FetchUserChatPayload {
  user_id_1: string;
  user_id_2: string;
  startDate: number;
  markRead: boolean;
}

export interface UserMessage {
  id: string;
  user_id_1: string;
  user_id_2: string;
  username: string;
  thumbnail: string;
  teaser: string;
  read: boolean;
  created_at: number;
}
