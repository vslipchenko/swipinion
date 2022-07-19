import {ElapsedTimeMeasure} from '~app/typings/date/date.enums';

// export const hasLessMillisecondsThanDay = (milliseconds: number): boolean => milliseconds < 1000 * 60 * 60 * 24;
//
// export const hasMoreMillisecondsThanDay = (milliseconds: number, inclusive: boolean): boolean =>
//   inclusive ? milliseconds >= 1000 * 60 * 60 * 24 : milliseconds > 1000 * 60 * 60 * 24;
export const millisecondsToMinutes = (milliseconds: number): number => Math.floor(milliseconds / (1000 * 60));

export const millisecondsToHours = (milliseconds: number): number => Math.floor(milliseconds / (1000 * 60 * 60));

export const millisecondsToDays = (milliseconds: number): number => Math.floor(milliseconds / (1000 * 60 * 60 * 24));

export const determineElapsedTimeMeasure = (milliseconds: number): ElapsedTimeMeasure => {
  switch (true) {
    case milliseconds < 1000 * 60:
      return ElapsedTimeMeasure.SECOND;
    case milliseconds < 1000 * 60 * 60:
      return ElapsedTimeMeasure.MINUTE;
    case milliseconds < 1000 * 60 * 60 * 24:
      return ElapsedTimeMeasure.HOUR;
    default:
      return ElapsedTimeMeasure.DAY;
  }
};
