import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {
  queryFetchUserChat,
  queryFetchUserMessages,
  queryMarkUserMessagesRead,
} from '../../../data/queries/user-messages';
import {unixTimestampValidator} from '../../../validators/shared';
import {FetchUserChatPayload} from '../../../typings/user-messages/user-messages.interfaces';
import {fetchUserChatValidator} from '../../../validators/user-messages';

export const userMessagesQueryTypeDefinitions = gql`
  type Query {
    fetchUserMessages(startDate: Float): [Message!]
    fetchUserChat(input: FetchUserChat): [Chat!]
  }
`;

const fetchUserMessages = async (
  _1: unknown,
  {startDate}: {startDate: number},
  {accessToken}: {accessToken: string},
): Promise<Array<unknown> | ApolloError | null> => {
  const {error} = unixTimestampValidator.validate(startDate);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query<unknown>(
    queryFetchUserMessages(tokenData.userId, startDate ? new Date(startDate).toISOString() : 'NOW()'),
  );

  if (!result.rowCount) return null;

  return result.rows;
};

const fetchUserChat = async (
  _1: unknown,
  {input}: {input: FetchUserChatPayload},
  {accessToken}: {accessToken: string},
): Promise<unknown | ApolloError | null> => {
  // TODO update validation
  const {error} = fetchUserChatValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  // Violation check: tries to fetch messages that don't belong to authorized user
  if (tokenData.userId !== input.user_id_1 && tokenData.userId !== input.user_id_2) return null;

  const startDate = input.startDate ? new Date(input.startDate).toISOString() : 'NOW()';

  if (input.markRead) {
    const senderId = tokenData.userId === input.user_id_1 ? input.user_id_2 : input.user_id_1;

    const result = await db.transaction(
      queryMarkUserMessagesRead(senderId, tokenData.userId),
      queryFetchUserChat(input.user_id_1, input.user_id_2, startDate),
    );

    return result;
  }

  const result = await db.query<unknown>(queryFetchUserChat(input.user_id_1, input.user_id_2, startDate));

  if (!result.rowCount) return null;

  return result.rows;
};

export const userMessagesQueryResolvers = {
  Query: {
    fetchUserMessages,
    fetchUserChat,
  },
};
