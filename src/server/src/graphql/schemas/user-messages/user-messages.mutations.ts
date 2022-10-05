import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {queryFetchAndMarkInterlocutorMessages, querySendUserMessage} from '../../../data/queries/user-messages';
import {sendUserMessageValidator} from '../../../validators/user-messages';
import {MESSAGE_TEASER_LENGTH} from '../../../constants/user-messages';
import {SendUserMessagePayload, SendUserMessageResult} from '../../../typings/user-messages/user-messages.interfaces';

export const userMessagesMutationTypeDefinitions = gql`
  type Mutation {
    sendUserMessage(input: SendUserMessage!): SendUserMessageResult
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

  const trimmedBody = input.body.trim();

  const result = await db.transaction(
    queryFetchAndMarkInterlocutorMessages(input.recipientId, tokenData.userId, input.edgeId),
    querySendUserMessage(tokenData.userId, input.recipientId, trimmedBody, trimmedBody.slice(0, MESSAGE_TEASER_LENGTH)),
  );

  return {
    success: result.success,
    results: {
      interlocutorMessages: result.results?.[0]?.rows, // result.results value is [] if transaction is unsuccessful
      sentMessage: result.results?.[1]?.rows?.[0],
    },
  };
};

export const userMessagesMutationResolvers = {
  Mutation: {
    sendUserMessage,
  },
};
