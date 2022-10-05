export interface FetchUserConversationPayload {
  user_id_1: string;
  user_id_2: string;
  edgeId: string;
  fetchNew: boolean;
  markRead: boolean;
}

export interface SendUserMessagePayload {
  edgeId: string;
  body: string;
  recipientId: string;
}

export interface SendUserMessageResult {
  success: boolean;
  results: {
    interlocutorMessages: unknown; // Unnecessary typing
    sentMessage: unknown;
  };
}
