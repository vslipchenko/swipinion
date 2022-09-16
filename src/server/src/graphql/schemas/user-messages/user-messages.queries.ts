import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {
  queryFetchNewUserMessages,
  queryFetchUserConversation,
  queryFetchUserMessages,
  queryMarkUserConversationMessagesRead,
} from '../../../data/queries/user-messages';
import {bigintValidator} from '../../../validators/shared';
import {FetchUserConversationPayload} from '../../../typings/user-messages/user-messages.interfaces';
import {fetchNewUserMessagesValidator, fetchUserConversationValidator} from '../../../validators/user-messages';
import {QueryResultRow} from 'pg';

export const userMessagesQueryTypeDefinitions = gql`
  type Query {
    fetchUserMessages(edgeId: String): [Message!]
    fetchNewUserMessages(input: [String!]!): [Message!]
    fetchUserConversation(input: FetchUserConversation): [Conversation!]
  }
`;

const fetchUserMessages = async (
  _1: unknown,
  {edgeId}: {edgeId: number},
  {accessToken}: {accessToken: string},
): Promise<Array<unknown> | ApolloError | null> => {
  const {error} = bigintValidator.validate(edgeId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryFetchUserMessages(tokenData.userId, edgeId));

  if (!result.rowCount) return null;

  return result.rows;
};

const fetchNewUserMessages = async (
  _1: unknown,
  {input}: {input: Array<string>},
  {accessToken}: {accessToken: string},
): Promise<Array<QueryResultRow> | ApolloError | null> => {
  const {error} = fetchNewUserMessagesValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryFetchNewUserMessages(input, tokenData.userId));

  if (!result.rowCount) return null;

  return result.rows;
};

const fetchUserConversation = async (
  _1: unknown,
  {input}: {input: FetchUserConversationPayload},
  {accessToken}: {accessToken: string},
): Promise<Array<QueryResultRow> | ApolloError | null> => {
  const {error} = fetchUserConversationValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  // Violation check: tries to fetch messages that don't belong to authorized user
  if (tokenData.userId !== input.user_id_1 && tokenData.userId !== input.user_id_2) return null;

  if (input.markRead) {
    const senderId = tokenData.userId === input.user_id_1 ? input.user_id_2 : input.user_id_1;

    const result = await db.transaction(
      queryMarkUserConversationMessagesRead(senderId, tokenData.userId),
      queryFetchUserConversation(input.user_id_1, input.user_id_2, input.edgeId, tokenData.userId),
    );

    return result.results[1].rows;
  }

  const result = await db.query(
    queryFetchUserConversation(input.user_id_1, input.user_id_2, input.edgeId, tokenData.userId),
  );

  if (!result.rowCount) return null;

  return result.rows;
};

export const userMessagesQueryResolvers = {
  Query: {
    fetchUserMessages,
    fetchNewUserMessages,
    fetchUserConversation,
  },
};
