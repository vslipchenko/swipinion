import {Translations} from '../typings/i18n/i18n.types';
import {environment} from '../environments';

export const EMAIL_FROM = `"Swipinion" <${environment.MAIL_USERNAME}>`;
export const EMAIL_CONFIRMATION_SUBJECT: Translations = {
  en: 'Email confirmation',
  // ru: 'Регистрация аккаунта',
};
export const EMAIL_CONFIRMATION_HTML: Translations = {
  // en: 'Please follow the <a href="{{appOrigin}}/#/confirmation?key={{confirmationCode}}">link</a> in order to activate account.',
  en: 'Email confirmation code: {{confirmationCode}}. Please enter this code in order to finish sign up process.',
  //ru: 'Для активации аккаунта, пожалуйста, перейдите по <a href="{{appOrigin}}/#/confirmation?key={{confirmationCode}}">ссылке</a>.',
};

export const PASSWORD_RECOVERY_SUBJECT: Translations = {
  en: 'Password recovery',
  //ru: 'Восстановление пароля',
};
export const PASSWORD_RECOVERY_HTML: Translations = {
  en: 'Please follow the <a href="{{appOrigin}}/#/reset?key={{resetKey}}">link</a> (lasts for 30 minutes). If you have not used password recovery, please ignore this message.',
  //ru: 'Для восстановления пароля, пожалуйста, перейдите по <a href="{{appOrigin}}/#/reset?key={{resetKey}}">ссылке</a> (действительна в течение 30 минут). Если вы не совершали никаких действий по восстановлению пароля, проигнорируйте данное сообщение.',
};
