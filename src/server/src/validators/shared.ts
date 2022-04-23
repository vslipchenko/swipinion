import Joi from "joi";
import {EMAIL_REGEXP, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REGEXP} from "../constants/validation";
import {getStringEnumValues} from "../utilities/enum";
import {LanguageLabel} from "../typings/i18n/i18n.enums";

export const emailValidator = Joi.string().regex(EMAIL_REGEXP);
export const passwordValidator = Joi.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH).regex(PASSWORD_REGEXP);
export const languageValidator = Joi.string().valid(...getStringEnumValues(LanguageLabel));

