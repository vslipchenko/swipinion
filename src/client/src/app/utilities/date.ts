import {ElapsedTimeMeasure, MessageTimePoint} from '~app/typings/date/date.enums';
import {MONTH_SHORTENINGS, MONTHS} from '~app/constants/date';

// export const hasLessMillisecondsThanDay = (milliseconds: number): boolean => milliseconds < 1000 * 60 * 60 * 24;
//
// export const hasMoreMillisecondsThanDay = (milliseconds: number, inclusive: boolean): boolean =>
//   inclusive ? milliseconds >= 1000 * 60 * 60 * 24 : milliseconds > 1000 * 60 * 60 * 24;
export const millisecondsToMinutes = (milliseconds: number): number => Math.floor(milliseconds / (1000 * 60));

export const millisecondsToHours = (milliseconds: number): number => Math.floor(milliseconds / (1000 * 60 * 60));

export const millisecondsToDays = (milliseconds: number): number => Math.floor(milliseconds / (1000 * 60 * 60 * 24));

export const millisecondsToWeeks = (milliseconds: number): number =>
  Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 7));

export const timestampToTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

export const timestampToMonthDay = (timestamp: number, fullMonth?: boolean): string => {
  const date = new Date(timestamp);
  const month = fullMonth ? MONTHS[date.getMonth()] : MONTH_SHORTENINGS[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}`;
};

export const timestampToMonthDayYear = (timestamp: number, fullMonth?: boolean): string => {
  const date = new Date(timestamp);

  return `${timestampToMonthDay(timestamp, fullMonth)}, ${date.getFullYear()}`;
};

export const determineElapsedTimeMeasure = (milliseconds: number): ElapsedTimeMeasure => {
  switch (true) {
    case milliseconds < 1000 * 60:
      return ElapsedTimeMeasure.SECOND;
    case milliseconds < 1000 * 60 * 60:
      return ElapsedTimeMeasure.MINUTE;
    case milliseconds < 1000 * 60 * 60 * 24:
      return ElapsedTimeMeasure.HOUR;
    case milliseconds < 1000 * 60 * 60 * 24 * 7:
      return ElapsedTimeMeasure.DAY;
    default:
      return ElapsedTimeMeasure.WEEK;
  }
};

export const determineMessageTimePoint = (timestamp: number): MessageTimePoint => {
  const date = new Date(timestamp);
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  const dateDay = date.getDate();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  switch (true) {
    case dateYear === year && dateMonth === month && dateDay === day:
      return MessageTimePoint.TODAY;
    case dateYear === year:
      return MessageTimePoint.THIS_YEAR;
    default:
      return MessageTimePoint.EARLIER;
  }
};
