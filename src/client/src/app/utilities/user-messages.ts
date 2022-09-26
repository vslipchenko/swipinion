import {
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

export const convertToUiMessages = (messages: Array<UserMessage>, userId: string): Array<UIUserMessage> => {
  return messages.map((message) => {
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
  });
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

export const markMessageRead = (messages: Array<UIUserMessage>, interlocutorId: string): Array<UIUserMessage> => {
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

export const actualizeConversationMessagesDate = (
  messages: Array<UIUserConversationMessage | UserConversationMessage>,
): Array<UIUserConversationMessage> => {
  const nextMessages = [];
  let date = 0;

  for (let i = messages.length - 1; i > -1; i--) {
    const message = messages[i];

    let nextMessage: UIUserConversationMessage = message;

    if (nextMessage.date) {
      // Clean-up existing dates
      nextMessage = {
        ...message,
      };

      delete nextMessage.date;
    }

    const dayTimestamp = new Date(message.created_at).setHours(0, 0, 0, 0);

    if (dayTimestamp === date) {
      nextMessages.unshift(nextMessage);
      continue;
    }

    nextMessage = {
      ...message,
    };

    nextMessage.date = String(new Date(nextMessage.created_at));

    date = dayTimestamp;

    nextMessages.unshift(nextMessage);
  }

  return nextMessages;
};
