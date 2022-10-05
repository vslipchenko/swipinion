import {
  Conversations,
  UIUserConversationMessage,
  UIUserMessage,
  UnreadMessage,
  UserConversationMessage,
  UserMessage,
} from '~app/typings/user-messages/user-messages.interfaces';
import {
  determineMessageTimePoint,
  timestampToMonthDay,
  timestampToMonthDayYear,
  timestampToTime,
} from '~app/utilities/date';
import {MessageTimePoint} from '~app/typings/date/date.enums';
import {composeRelationKey} from '~app/utilities/data';

export const convertToUiMessage = (message: UserMessage, userId: string): UIUserMessage => {
  const timePoint = determineMessageTimePoint(message.created_at);
  let date;

  switch (timePoint) {
    case MessageTimePoint.TODAY:
      date = timestampToTime(message.created_at);
      break;
    case MessageTimePoint.THIS_YEAR:
      date = timestampToMonthDay(message.created_at);
      break;
    default:
      date = timestampToMonthDayYear(message.created_at);
  }

  const nextMessage: UIUserMessage = {
    ...message,
    unread: false,
    date,
  };
  // Mark unread if sender is not current user and read value is false
  if (!message.read) nextMessage.unread = message.sender_id !== userId;

  return nextMessage;
};

export const convertToUiMessages = (messages: Array<UserMessage>, userId: string): Array<UIUserMessage> => {
  return messages.map((message) => convertToUiMessage(message, userId));
};

export const excludeNewMessages = (
  userId: string,
  messages: Array<UIUserMessage>,
  newMessages: Array<UIUserMessage>,
): Array<UIUserMessage> => {
  return messages.filter(
    // This will allow to bubble up existing conversations thus avoiding duplicates
    (message) => {
      const interlocutorId = getInterlocutorId(message.sender_id, message.recipient_id, userId);

      const hasNewMessage = newMessages.some(
        (item) => item.sender_id === interlocutorId || item.recipient_id === interlocutorId,
      );

      return !hasNewMessage;
    },
  );
};

export const getInterlocutorId = (userId1: string, userId2: string, userId: string): string =>
  userId1 === userId ? userId2 : userId1;

export const actualizeUnreadMessages = (
  unreadMessages: Array<UnreadMessage>,
  interlocutorId: string,
): Array<UnreadMessage> => {
  // const hasUnread = unreadMessages.some((message) => message.sender_id === interlocutorId);
  //
  // if (!hasUnread) return unreadMessages;

  return unreadMessages.filter((message) => message.sender_id !== interlocutorId);
};

export const markMessagesRead = (messages: Array<UIUserMessage>, interlocutorId: string): Array<UIUserMessage> => {
  return messages.map((message) => {
    if (message.sender_id === interlocutorId || message.recipient_id === interlocutorId)
      return {
        ...message,
        // Consider to set read property to true as well
        unread: false,
      };

    return message;
  });
};

export const defineConversationMessagesTime = (
  messages: Array<UserConversationMessage>,
): Array<UIUserConversationMessage> => {
  return messages.map((message) => {
    return {
      ...message,
      time: timestampToTime(message.created_at),
    };
  });
};

export const actualizeConversationMessagesDateTiles = (
  messages: Array<UIUserConversationMessage>,
): Array<UIUserConversationMessage> => {
  const nextMessages = [];
  let date = 0;

  for (let i = messages.length - 1; i > -1; i--) {
    const message = messages[i];

    let nextMessage: UIUserConversationMessage = message;

    if (nextMessage.dateTile) {
      // Clean-up existing dates
      nextMessage = {
        ...message,
      };

      delete nextMessage.dateTile;
    }

    const dayTimestamp = new Date(message.created_at).setHours(0, 0, 0, 0);

    if (dayTimestamp === date) {
      nextMessages.unshift(nextMessage);
      continue;
    }

    const timePoint = determineMessageTimePoint(message.created_at);
    let dateTile = '';

    switch (timePoint) {
      case MessageTimePoint.TODAY:
        dateTile = 'Today';
        break;
      case MessageTimePoint.THIS_YEAR:
        dateTile = timestampToMonthDay(message.created_at, true);
        break;
      default:
        dateTile = timestampToMonthDayYear(message.created_at, true);
    }

    nextMessages.unshift({
      ...message,
      dateTile,
    });

    date = dayTimestamp;
  }

  return nextMessages;
};

export const actualizeConversationMessagesReadStatus = (
  messages: Array<UIUserConversationMessage>,
  lastReadMessageId: string,
  userId: string,
): Array<UIUserConversationMessage> => {
  const nextMessages: Array<UIUserConversationMessage> = [];

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];

    if (!message.read && message.id <= lastReadMessageId && message.sender_id === userId) {
      // Ignore messages from interlocutor or that which are read already or id is greater than latestSeenMessageId
      // Mark as read
      nextMessages.push({
        ...message,
        read: true,
      });
      continue;
    }

    nextMessages.push(message);
  }

  return nextMessages;
};

export const getConversationKey = (conversations: Conversations, userId1: string, userId2: string): string => {
  const key1 = composeRelationKey(userId1, userId2);

  return conversations[key1] ? key1 : composeRelationKey(userId2, userId1);
};
