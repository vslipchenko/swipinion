const isDevEnv = Boolean(process.env.TS_NODE_DEV); // As ts-node-dev is probably is not going to be used in prod

export const environment: {
  // name: 'development' | 'production';
  // isDevEnv: boolean;
  APP_ORIGIN: string;
  PORT: number;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_HOSTNAME: string;
  DB_PORT: number;
  MAIL_SERVICE: string;
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USERNAME: string;
  MAIL_PASSWORD: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  RECOVERY_SECRET: string;
  RECOVERY_KEY_EXPIRES_IN: string;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require(`./${isDevEnv ? 'development' : 'production'}.ts`);
