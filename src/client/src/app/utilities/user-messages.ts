import {UIUserMessage, UserMessage} from '~app/typings/user-messages/user-messages.interfaces';
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
