export interface SendUserMessage {
  edgeId?: string;
  recipientId: string;
  body: string;
}

interface SendUserMessageResult {
  success: boolean;
  results: {
    interlocutorMessages: Array<UserConversationMessage>;
    sentMessage: UserConversationMessage;
  };
}

export interface SendUserMessageMutationResult {
  sendUserMessage: SendUserMessageResult;
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

export interface CheckConversationMessageStatusQueryResult {
  checkConversationMessageStatus: string;
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
  time: string;
  dateTile?: string;
}

export interface Messages {
  messages: Array<UIUserMessage>;
  canLoadMore: boolean;
}

export interface Conversations {
  [key: string]: {
    messages: Array<UIUserConversationMessage>;
    canLoadMore: boolean;
  };
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

export interface SendUserMessagePayload extends SendUserMessage {
  username: string;
  thumbnail: string;
}
