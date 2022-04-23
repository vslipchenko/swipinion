import {Translations} from "../typings/i18n/i18n.types";

export const EMAIL_FROM = '"Swipinion"';
export const EMAIL_CONFIRMATION_SUBJECT: Translations = {
  en: 'Account confirmation',
  ru: 'Регистрация аккаунта',
};
export const EMAIL_CONFIRMATION_HTML: Translations = {
  en: '', // TODO
  ru: 'Для активации аккаунта, пожалуйста, перейдите по <a href="{{appOrigin}}/#/confirmation?key={{confirmationKey}}">ссылке</a>.',
};

export const PASSWORD_RECOVERY_SUBJECT: Translations = {
  en: '',
  ru: 'Восстановление пароля',
};
export const PASSWORD_RECOVERY_HTML: Translations = {
  en: '',
  ru: 'Для восстановления пароля, пожалуйста, перейдите по <a href="{{appOrigin}}/#/reset?key={{resetKey}}">ссылке</a> (действительна в течение 30 минут). Если вы не совершали никаких действий по восстановлению пароля, проигнорируйте данное сообщение.',
};
