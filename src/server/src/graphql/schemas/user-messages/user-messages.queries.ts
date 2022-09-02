import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {
  queryFetchUserChat,
  queryFetchUserMessages,
  queryMarkUserMessagesRead,
} from '../../../data/queries/user-messages';
import {bigintValidator} from '../../../validators/shared';
import {FetchUserChatPayload} from '../../../typings/user-messages/user-messages.interfaces';
import {fetchUserChatValidator} from '../../../validators/user-messages';

export const userMessagesQueryTypeDefinitions = gql`
  type Query {
    fetchUserMessages(edgeId: String): [Message!]
    fetchUserChat(input: FetchUserChat): [Chat!]
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

const fetchUserChat = async (
  _1: unknown,
  {input}: {input: FetchUserChatPayload},
  {accessToken}: {accessToken: string},
): Promise<unknown | ApolloError | null> => {
  const {error} = fetchUserChatValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  // Violation check: tries to fetch messages that don't belong to authorized user
  if (tokenData.userId !== input.user_id_1 && tokenData.userId !== input.user_id_2) return null;

  if (input.markRead) {
    const senderId = tokenData.userId === input.user_id_1 ? input.user_id_2 : input.user_id_1;

    const result = await db.transaction(
      queryMarkUserMessagesRead(senderId, tokenData.userId),
      queryFetchUserChat(input.user_id_1, input.user_id_2, input.edgeId),
    );

    return result.results[1].rows;
  }

  const result = await db.query(queryFetchUserChat(input.user_id_1, input.user_id_2, input.edgeId));

  if (!result.rowCount) return null;

  return result.rows;
};

export const userMessagesQueryResolvers = {
  Query: {
    fetchUserMessages,
    fetchUserChat,
  },
};
