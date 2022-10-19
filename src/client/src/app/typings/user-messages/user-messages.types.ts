import {
  MessageList,
  UIUserConversationMessage,
  UIUserMessage,
} from '~app/typings/user-messages/user-messages.interfaces';

export type Messages = MessageList<UIUserMessage>;
export type Conversation = MessageList<UIUserConversationMessage>;
