// See https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
export const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 50;
// At least 1 letter & 1 number; includes all special characters
export const PASSWORD_REGEXP = RegExp(
  '^(?=.*[0-9])(?=.*[A-Za-z])[0-9A-Za-z!"#$%&\'()\\[\\]*+,./\\\\:;<=>?@^_`{|}~-]*$',
);

// See https://github.com/uuidjs/uuid/blob/main/src/regex.js
// export const UUID_REGEXP =
//   /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

export const USERNAME_REGEXP = /^[a-z\d]+(?:(\.)[a-z\d]+)*$/;
export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 30;
export const CODE_REGEXP = /^[0-9a-fA-F]{6}$/;
export const FILE_URL_MAX_LENGTH = 2048;
export const BIO_MAX_LENGTH = 300;
export const TAG_REGEXP = /^(?=.{1,35}$)[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*$/;
export const MAX_TAG_COUNT = 10;
export const BIGINT_REGEXP = /^\d{1,19}$/;
export const OPINION_BODY_MAX_LENGTH = 3000;
export const OPINION_COMMENT_MAX_LENGTH = 3000;
export const USER_MESSAGE_MAX_LENGTH = 3000;
