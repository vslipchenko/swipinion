import {randomBytes, randomUUID} from 'crypto';
import {gql} from 'apollo-server-core';
import {CreateUser, RecoverPassword, ResetPassword} from '../../../typings/user/user.interfaces';
import {hashSync} from 'bcrypt';
import {db} from '../../../data';
import {confirmationKeyValidator, createUserValidator, recoverPasswordValidator} from '../../../validators/user';
import {mailer} from '../../../utilities/mail';
import {
  queryUserCheckExistenceByEmail,
  queryUserConfirmAccount,
  queryUserCreate,
  queryUserDeleteByEmail,
  queryUserResetPassword,
} from '../../../data/queries/user';
import {
  EMAIL_CONFIRMATION_HTML,
  EMAIL_CONFIRMATION_SUBJECT,
  EMAIL_FROM,
  PASSWORD_RECOVERY_HTML,
  PASSWORD_RECOVERY_SUBJECT,
} from '../../../constants/email';
import {imprint} from '../../../utilities/string';
import {environment} from '../../../environments';
import {sign, verify} from 'jsonwebtoken';
import {JWT_ALGORITHM} from '../../../constants/jwt';
import {passwordValidator} from '../../../validators/shared';

export const userMutationTypeDefinitions = gql`
  type Mutation {
    createUser(input: CreateUser!): Success
    confirmAccount(key: String!): Success
    recoverPassword(input: RecoverPassword!): Success
    resetPassword(input: ResetPassword!): Success
  }
`;

const createUser = async (_: unknown, {input}: {input: CreateUser}): Promise<{success: boolean} | null> => {
  const {error} = createUserValidator.validate(input);

  if (error) return null;

  input.password = hashSync(input.password, 10);

  const confirmationKey = randomUUID();
  const accessKey = randomBytes(18).toString('base64'); // Produces string of 24 char length

  const result = await db.query(
    queryUserCreate({
      ...input,
      confirmationKey: randomUUID(),
      accessKey,
    }),
  );

  if (!result.rowCount) return {success: false};

  try {
    await mailer.sendMail({
      from: EMAIL_FROM,
      to: input.email,
      subject: EMAIL_CONFIRMATION_SUBJECT[input.language],
      html: imprint(EMAIL_CONFIRMATION_HTML[input.language], {confirmationKey, appOrigin: environment.APP_ORIGIN}),
    });
  } catch (error) {
    console.log(error);
    await db.query(queryUserDeleteByEmail(input.email));

    return {success: false};
  }

  return {success: true};
};

const confirmAccount = async (_: unknown, {key}: {key: string}): Promise<{success: boolean} | null> => {
  const {error} = confirmationKeyValidator.validate(key);

  if (error) return null;

  const result = await db.query(queryUserConfirmAccount(key));

  return {success: Boolean(result.rowCount)};
};

const recoverPassword = async (_: unknown, {input}: {input: RecoverPassword}): Promise<{success: boolean} | null> => {
  const {error} = recoverPasswordValidator.validate(input);

  if (error) return null;

  const result = await db.query(queryUserCheckExistenceByEmail(input.email));

  if (!result.rowCount) return {success: false};

  const resetKey = sign({email: input.email}, environment.RECOVERY_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: environment.RECOVERY_KEY_EXPIRES_IN,
  });

  try {
    await mailer.sendMail({
      from: EMAIL_FROM,
      to: input.email,
      subject: PASSWORD_RECOVERY_SUBJECT[input.language],
      html: imprint(PASSWORD_RECOVERY_HTML[input.language], {resetKey, appOrigin: environment.APP_ORIGIN}),
    });

    return {success: true};
  } catch {
    return {success: false};
  }
};

const resetPassword = async (_: unknown, {input}: {input: ResetPassword}): Promise<{success: boolean} | null> => {
  // Validate key with the use of jwt lib instead
  const {error} = passwordValidator.validate(input.password);

  if (error) return null;

  try {
    const data = verify(input.key, environment.RECOVERY_SECRET, {algorithms: [JWT_ALGORITHM]}) as {email: string};

    input.password = hashSync(input.password, 10);

    const result = await db.query(queryUserResetPassword(data.email, input.password));

    return {success: Boolean(result.rowCount)};
  } catch {
    return {success: false};
  }
};

export const userMutationResolvers = {
  Mutation: {
    createUser,
    confirmAccount,
    recoverPassword,
    resetPassword,
  },
};
