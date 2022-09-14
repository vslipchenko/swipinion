import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {SuccessResponse} from '../../../typings/response/response.interfaces';
import {querySendUserMessage} from '../../../data/queries/user-messages';
import {sendUserMessageValidator} from '../../../validators/user-messages';
import {MESSAGE_TEASER_LENGTH} from '../../../constants/user-messages';

export const userMessagesMutationTypeDefinitions = gql`
  type Mutation {
    sendUserMessage(input: SendUserMessage!): Success
  }
`;

const sendUserMessage = async (
  _: unknown,
  {input}: {input: {recipientId: string; body: string}},
  {accessToken}: {accessToken: string},
): Promise<SuccessResponse | ApolloError | null> => {
  const {error} = sendUserMessageValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const trimmedBody = input.body.trim();

  const result = await db.query(
    querySendUserMessage(
      tokenData.userId,
      input.recipientId,
      trimmedBody,
      trimmedBody.slice(0, MESSAGE_TEASER_LENGTH),
    ),
  );

  return {success: Boolean(result.rowCount)};
};

export const userMessagesMutationResolvers = {
  Mutation: {
    sendUserMessage,
  },
};
