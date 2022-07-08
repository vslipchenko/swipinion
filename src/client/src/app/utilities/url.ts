import {HTTP_PROTOCOL_REGEXP} from '~app/constants/validation';
import {UrlMatchResult, UrlSegment} from '@angular/router';

export const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return HTTP_PROTOCOL_REGEXP.test(url.protocol);
  } catch {
    return false;
  }
};

// This one is a straight ahead matcher, does not support posParams
export const pathMatchAny = (paths: Array<string>) => {
  return (segments: Array<UrlSegment>): null | UrlMatchResult => {
    // console.log(
    //   paths.includes(segments.map((item) => item.path).join('/')),
    //   paths,
    //   segments.map((item) => item.path).join('/'),
    // );
    return paths.includes(segments.map((item) => item.path).join('/'))
      ? ({consumed: segments} as UrlMatchResult)
      : null;
  };
};
