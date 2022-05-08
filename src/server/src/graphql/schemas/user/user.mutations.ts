import {randomBytes} from 'crypto';
import {gql} from 'apollo-server-core';
import {CreateUser, RecoverPassword, ResetPassword} from '../../../typings/user/user.interfaces';
import {hashSync} from 'bcrypt';
import {db} from '../../../data';
import {userCodeValidator, createUserValidator, recoverPasswordValidator} from '../../../validators/user';
import {mailer} from '../../../utilities/mail';
import {
  queryUserConfirmEmail,
  queryUserCreate,
  queryUserDeleteByEmail,
  queryUserResetPassword,
  queryUserResetRecoveryCode,
  queryUserSetRecoveryCodeByEmail,
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
import {verify} from 'jsonwebtoken';
import {JWT_ALGORITHM} from '../../../constants/jwt';
import {passwordValidator} from '../../../validators/shared';

export const userMutationTypeDefinitions = gql`
  type Mutation {
    createUser(input: CreateUser!): Success
    confirmEmail(input: UserCode!): Success
    recoverPassword(input: RecoverPassword!): Success
    resetPassword(input: ResetPassword!): Success
  }
`;

const createUser = async (_: unknown, {input}: {input: CreateUser}): Promise<{success: boolean} | null> => {
  const {error} = createUserValidator.validate(input);

  if (error) return null;

  input.password = hashSync(input.password, 10);

  // const confirmationCode = randomUUID();
  const confirmationCode = randomBytes(3).toString('hex').toUpperCase();
  const accessKey = randomBytes(18).toString('base64'); // Produces string of 24 char length

  const result = await db.query(
    queryUserCreate({
      ...input,
      // confirmationCode: randomUUID(),
      confirmationCode,
      accessKey,
    }),
  );

  if (!result.rowCount) return {success: false};

  try {
    await mailer.sendMail({
      from: EMAIL_FROM,
      to: input.email,
      subject: EMAIL_CONFIRMATION_SUBJECT[input.language],
      html: imprint(EMAIL_CONFIRMATION_HTML[input.language], {confirmationCode}),
    });
  } catch {
    await db.query(queryUserDeleteByEmail(input.email));

    return {success: false};
  }

  return {success: true};
};

const confirmEmail = async (
  _: unknown,
  {input}: {input: {email: string; code: string}},
): Promise<{success: boolean} | null> => {
  const {error} = userCodeValidator.validate(input);

  if (error) return null;

  const result = await db.query(queryUserConfirmEmail(input.email, input.code.toUpperCase()));

  return {success: Boolean(result.rowCount)};
};

const recoverPassword = async (_: unknown, {input}: {input: RecoverPassword}): Promise<{success: boolean} | null> => {
  const {error} = recoverPasswordValidator.validate(input);

  if (error) return null;

  const recoveryCode = randomBytes(3).toString('hex').toUpperCase();

  // const result = await db.query(queryUserCheckExistenceByEmail(input.email));
  const result = await db.query(queryUserSetRecoveryCodeByEmail(recoveryCode, input.email));

  if (!result.rowCount) return {success: false};

  // const resetKey = sign({email: input.email}, environment.RECOVERY_SECRET, {
  //   algorithm: JWT_ALGORITHM,
  //   expiresIn: environment.RECOVERY_KEY_EXPIRES_IN,
  // });

  try {
    await mailer.sendMail({
      from: EMAIL_FROM,
      to: input.email,
      subject: PASSWORD_RECOVERY_SUBJECT[input.language],
      html: imprint(PASSWORD_RECOVERY_HTML[input.language], {recoveryCode}),
    });

    return {success: true};
  } catch {
    await db.query(queryUserResetRecoveryCode(input.email));

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
    confirmEmail,
    recoverPassword,
    resetPassword,
  },
};
