import {insertCommaAtPosition} from '~app/utilities/string';

export const formatStatisticNumber = (value: number): string => {
  let formattedStatistic = '';

  switch (true) {
    case value < 1000:
      formattedStatistic = value.toString();
      break;
    case value < 10_000: {
      const slice = value.toString().slice(0, 2);
      const isFloat = slice[1] !== '0';

      formattedStatistic = isFloat ? `${insertCommaAtPosition(slice, 1)}k` : `${slice[0]}k`;
      break;
    }
    case value < 100_000: {
      const slice = value.toString().slice(0, 3);
      const isFloat = slice[2] !== '0';

      formattedStatistic = isFloat ? `${insertCommaAtPosition(slice, 2)}k` : `${slice.slice(0, -1)}k`;
      break;
    }
    case value < 1_000_000: {
      const slice = value.toString().slice(0, 4);
      const isFloat = slice[3] !== '0';

      formattedStatistic = isFloat ? `${insertCommaAtPosition(slice, 3)}k` : `${slice.slice(0, -1)}k`;
      break;
    }
    case value < 10_000_000: {
      const slice = value.toString().slice(0, 2);
      const isFloat = slice[1] !== '0';

      formattedStatistic = isFloat ? `${insertCommaAtPosition(slice, 1)}m` : `${slice.slice(0, -1)}m`;
      break;
    }
    case value < 100_000_000: {
      const slice = value.toString().slice(0, 3);
      const isFloat = slice[2] !== '0';

      formattedStatistic = isFloat ? `${insertCommaAtPosition(slice, 2)}m` : `${slice.slice(0, -1)}m`;
      break;
    }
    case value < 1_000_000_000: {
      const slice = value.toString().slice(0, 4);
      const isFloat = slice[3] !== '0';

      formattedStatistic = isFloat ? `${insertCommaAtPosition(slice, 3)}m` : `${slice.slice(0, -1)}m`;
      break;
    }
    case value < 10_000_000_000: {
      const slice = value.toString().slice(0, 2);
      const isFloat = slice[1] !== '0';

      formattedStatistic = isFloat ? `${insertCommaAtPosition(slice, 1)}b` : `${slice.slice(0, -1)}b`;
      break;
    }
  }

  return formattedStatistic;
};
