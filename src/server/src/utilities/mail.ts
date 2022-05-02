import nodemailer from 'nodemailer';
import {environment} from '../environments';

export const mailer = nodemailer.createTransport({
  // service: environment.MAIL_SERVICE,
  // auth: {
  //   user: environment.MAIL_USERNAME,
  //   pass: environment.MAIL_PASSWORD,
  // },
  host: environment.MAIL_HOST,
  // port: 587,
  port: environment.MAIL_PORT,
  // secure: environment.MAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: environment.MAIL_USERNAME, // generated ethereal user
    pass: environment.MAIL_PASSWORD, // generated ethereal password
  },
});
