import {SuccessResponse} from '~app/typings/response/response.interfaces';

export interface SendUserMessage {
  recipientId: string;
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
  edgeId: string;
  markRead: boolean;
}

export interface UserMessage {
  id: string;
  user_id_1: string;
  user_id_2: string;
  sender_id: string;
  username: string;
  thumbnail: string;
  teaser: string;
  read: boolean;
  created_at: number;
}

export interface UIUserMessage extends UserMessage {
  date: string;
  unread: boolean;
}

export interface UnreadMessage {
  id: string;
  sender_id: string;
}
