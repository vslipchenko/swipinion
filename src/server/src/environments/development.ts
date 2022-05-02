export = {
  APP_ORIGIN: 'http://localhost:4200',
  PORT: 4000,
  DB_NAME: 'swipinion',
  DB_USERNAME: 'postgres',
  DB_PASSWORD: 'root',
  DB_HOSTNAME: '127.0.0.1',
  DB_PORT: 5432,
  MAIL_HOST: 'smtp.ethereal.email',
  MAIL_PORT: 587,
  MAIL_USERNAME: 'alek.rolfson32@ethereal.email',
  MAIL_PASSWORD: 'JrsGEMwSXjrMngMeAG',
  ACCESS_TOKEN_EXPIRES_IN: '5m',
  REFRESH_TOKEN_EXPIRES_IN: '30d',
  ACCESS_TOKEN_SECRET: '`uBj$R42VQZ]U6uQjV<+>raXm.K&tC`tYn.MYWnwGps=3/+yQh`W6@.Y&e36wh&g', // 64 chars / 512 bits
  REFRESH_TOKEN_SECRET: 'E+)t9!@XAnywH&.8.=^GS#u$$SaCv*m2A-k65j{?', // 40 chars + 24 chars of access key = 64 / 512 bits; per https://stackoverflow.com/a/30520284
  RECOVERY_SECRET: 'AHDxcGRC,;?8`bX*K/as`:^t}TH^@SLWqW^Er]g%r-nW<X.f[Nw4+X*[;G+Rw=%W',
  RECOVERY_KEY_EXPIRES_IN: '30m',
};
