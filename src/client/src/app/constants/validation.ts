// See https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
export const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 50;
// At least 1 letter & 1 number; includes all special characters
export const PASSWORD_REGEXP = RegExp(
  '^(?=.*[0-9])(?=.*[A-Za-z])[0-9A-Za-z!"#$%&\'()\\[\\]*+,./\\\\:;<=>?@^_`{|}~-]*$',
);

export const USERNAME_REGEXP = /^[a-z\d]+(?:(\.)[a-z\d]+)*$/;
export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 30;

export const CODE_REGEXP = /^[0-9a-fA-F]{6}$/;

export const HASHTAG_REGEXP = /^[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*$/;
export const MAX_IMAGE_SIZE_MB = 30; // ImgBB image size limit - 32MB
export const HTTP_PROTOCOL_REGEXP = /^https?:$/;
