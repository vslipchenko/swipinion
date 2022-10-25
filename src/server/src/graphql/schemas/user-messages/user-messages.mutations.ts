import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {
  queryFetchAndMarkInterlocutorMessages,
  querySendUserMessage,
  querySendUserSavedMessage,
} from '../../../data/queries/user-messages';
import {sendUserMessageValidator} from '../../../validators/user-messages';
import {SendUserMessagePayload, SendUserMessageResult} from '../../../typings/user-messages/user-messages.interfaces';
import {messageBodyValidator} from '../../../validators/shared';
import {QueryResultRow} from 'pg';
import {convertBodyToTeaser} from '../../../utilities/user-messages';

export const userMessagesMutationTypeDefinitions = gql`
  type Mutation {
    sendUserMessage(input: SendUserMessage!): SendUserMessageResult
    sendUserSavedMessage(input: String!): SendUserSavedMessage
  }
`;

const sendUserMessage = async (
  _: unknown,
  {input}: {input: SendUserMessagePayload},
  {accessToken}: {accessToken: string},
): Promise<SendUserMessageResult | ApolloError | null> => {
  const {error} = sendUserMessageValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  if (input.recipientId === tokenData.userId) return null; // Prevent self sent messages

  const trimmedBody = input.body.trim();

  const result = await db.transaction(
    queryFetchAndMarkInterlocutorMessages(input.recipientId, tokenData.userId, input.edgeId),
    querySendUserMessage(tokenData.userId, input.recipientId, trimmedBody, convertBodyToTeaser(trimmedBody)),
  );

  return {
    success: result.success,
    results: {
      interlocutorMessages: result.results?.[0]?.rows, // result.results value is [] if transaction is unsuccessful
      sentMessage: result.results?.[1]?.rows?.[0],
    },
  };
};

const sendUserSavedMessage = async (
  _: unknown,
  {input}: {input: string},
  {accessToken}: {accessToken: string},
): Promise<QueryResultRow | ApolloError | null> => {
  const {error} = messageBodyValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const trimmedBody = input.trim();

  const result = await db.query(
    querySendUserSavedMessage(tokenData.userId, trimmedBody, convertBodyToTeaser(trimmedBody)),
  );

  if (!result.rowCount) return null;

  return result.rows[0];
};

export const userMessagesMutationResolvers = {
  Mutation: {
    sendUserMessage,
    sendUserSavedMessage,
  },
};
