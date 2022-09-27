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

export interface FetchNewUserMessagesQueryResult {
  fetchNewUserMessages: Array<UserMessage>;
}

export interface FetchUserConversationQueryResult {
  fetchUserConversation: Array<UserConversationMessage>;
}

export interface FetchUserConversationPayload {
  user_id_1: string;
  user_id_2: string;
  edgeId: string;
  markRead: boolean;
  fetchNew: boolean; // true - fetch new messages; false - fetch previous messages
}

export interface UserConversationMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  read: boolean;
  created_at: number;
}

export interface UIUserConversationMessage extends UserConversationMessage {
  dateTile?: string;
}

export interface UserMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
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
