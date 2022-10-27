import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {
  queryFetchNewUserMessages,
  queryFetchSavedUserMessage,
  queryFetchUserConversation,
  queryFetchUserMessages,
  queryFetchUserSavedMessages,
  queryMarkUserConversationMessagesRead,
  queryUserConversationMessageStatus,
} from '../../../data/queries/user-messages';
import {bigintValidator} from '../../../validators/shared';
import {FetchUserConversationPayload} from '../../../typings/user-messages/user-messages.interfaces';
import {fetchNewUserMessagesValidator, fetchUserConversationValidator} from '../../../validators/user-messages';
import {QueryResultRow} from 'pg';
import {getInterlocutorId} from '../../../utilities/user-messages';

export const userMessagesQueryTypeDefinitions = gql`
  type Query {
    fetchUserMessages(edgeId: String): [Message!]
    fetchUserSavedMessages(edgeId: String): [SavedMessage!]
    fetchNewUserMessages(input: [String!]!): [Message!]
    fetchUserConversation(input: FetchUserConversation): [ConversationMessage!]
    checkConversationMessageStatus(input: String!): String
  }
`;

const fetchUserMessages = async (
  _: unknown,
  {edgeId}: {edgeId: string},
  {accessToken}: {accessToken: string},
): Promise<Array<unknown> | ApolloError | null> => {
  const {error} = bigintValidator.validate(edgeId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryFetchUserMessages(tokenData.userId, edgeId));

  if (!edgeId) {
    const savedMessageResult = await db.query(queryFetchSavedUserMessage(tokenData.userId));

    if (savedMessageResult.rowCount) result.rows.push(savedMessageResult.rows[0]);
  }

  return result.rows; // Return either [] | [saved_message] | [...messages, saved_message] to improve resilience
};

const fetchUserSavedMessages = async (
  _: unknown,
  {edgeId}: {edgeId: string},
  {accessToken}: {accessToken: string},
): Promise<Array<unknown> | ApolloError | null> => {
  const {error} = bigintValidator.validate(edgeId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryFetchUserSavedMessages(tokenData.userId, edgeId));

  return result.rows;
};

const fetchNewUserMessages = async (
  _: unknown,
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
  _: unknown,
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
    const interlocutorId = getInterlocutorId(input.user_id_1, input.user_id_2, tokenData.userId);

    const result = await db.transaction(
      queryMarkUserConversationMessagesRead(interlocutorId, tokenData.userId),
      queryFetchUserConversation(input, tokenData.userId),
    );

    return result.results[1].rows;
  }

  const result = await db.query(queryFetchUserConversation(input, tokenData.userId));

  return result.rows;
};

const checkConversationMessageStatus = async (
  _: unknown,
  {input}: {input: string},
  {accessToken}: {accessToken: string},
): Promise<Array<unknown> | ApolloError | null> => {
  const {error} = bigintValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryUserConversationMessageStatus(tokenData.userId, input));

  if (!result.rowCount) return null;

  return result.rows[0].id;
};

export const userMessagesQueryResolvers = {
  Query: {
    fetchUserMessages,
    fetchUserSavedMessages,
    fetchNewUserMessages,
    fetchUserConversation,
    checkConversationMessageStatus,
  },
};
