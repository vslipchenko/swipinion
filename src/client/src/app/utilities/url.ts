import {HTTP_PROTOCOL_REGEXP} from '~app/constants/validation';

export const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return HTTP_PROTOCOL_REGEXP.test(url.protocol);
  } catch {
    return false;
  }
};
