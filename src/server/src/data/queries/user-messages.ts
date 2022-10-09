import {QueryConfig} from 'pg';
import {PrivacyCommonSettings} from '../../typings/user-settings/user-settings.enums';
import {USER_CONVERSATION_MESSAGES_FETCH_LIMIT, USER_MESSAGES_FETCH_LIMIT} from '../../constants/user-messages';
import {FetchUserConversationPayload} from '../../typings/user-messages/user-messages.interfaces';

export const querySendUserMessage = (
  senderId: string,
  recipientId: string,
  body: string,
  teaser: string,
): QueryConfig => ({
  text: `
    INSERT INTO user_messages (recipient_id, sender_id, body, teaser)
    VALUES (
      (
        SELECT user_settings.user_id
        FROM   user_settings
               LEFT JOIN user_followers
                      ON user_settings.user_id = user_followers.user_id
        WHERE  user_settings.user_id = $2 
               AND (
                user_settings.message != ${PrivacyCommonSettings.NoOne}       -- Check whether messaging is disabled on behalf of receiver
                AND user_settings.message = ${PrivacyCommonSettings.Everyone}     -- Check whether messaging is allowed to everyone
                  OR user_followers.follower_id = $1                               -- If messaging is allowed only for followers; check whether sender has accepted following
                     AND user_followers.pending IS FALSE
                )
      ),
      $1,
      $3,
      $4
    )
    RETURNING
      id, 
      sender_id,
      recipient_id,
      body, 
      created_at, 
      read
  `,
  values: [senderId, recipientId, body, teaser],
});

export const queryFetchAndMarkInterlocutorMessages = (
  senderId: string,
  recipientId: string,
  edgeId?: string,
): QueryConfig => ({
  text: `
    WITH updated AS 
    (
      UPDATE user_messages
      SET read = TRUE
      WHERE ${edgeId ? 'id > $3 AND' : ''} sender_id = $1 AND recipient_id = $2
      RETURNING id, body, created_at
    )
    SELECT id, body, created_at
    FROM updated
    ORDER BY id DESC
  `,
  values: edgeId ? [senderId, recipientId, edgeId] : [senderId, recipientId],
});

export const querySendUserSavedMessage = (userId: string, body: string, teaser: string): QueryConfig => ({
  text: `
    INSERT INTO user_saved_messages
    (user_id, body, teaser)
    VALUES ($1, $2, $3)
    RETURNING id, created_at
  `,
  values: [userId, body, teaser],
});

export const queryFetchSavedUserMessage = (userId: string): QueryConfig => ({
  text: `
    SELECT id, teaser, created_at
    FROM user_saved_messages
    WHERE user_id = $1
    ORDER BY id DESC
    LIMIT 1
  `,
  values: [userId],
});

export const queryFetchUserMessages = (userId: string, edgeId?: string): QueryConfig => ({
  text: `
    SELECT conversations.conversation_id AS id, 
      user_messages.sender_id,
      user_messages.recipient_id,
      user_messages.created_at, 
      user_messages.teaser,
      user_messages.read,
      users.username, 
      users.thumbnail
    FROM 
    (
      SELECT DISTINCT GREATEST(sender_id, recipient_id), LEAST(sender_id, recipient_id), MAX(id) AS conversation_id
      FROM user_messages
      WHERE sender_id = $1
        OR recipient_id = $1
      GROUP BY GREATEST(sender_id, recipient_id), LEAST(sender_id, recipient_id)
      ${edgeId ? 'HAVING MAX(id) < $3' : ''}
      ORDER BY conversation_id DESC
      LIMIT $2
    ) AS conversations
    LEFT JOIN user_messages ON  user_messages.id = conversations.conversation_id
    LEFT JOIN users ON (users.id = user_messages.recipient_id OR users.id = user_messages.sender_id) AND users.id != $1
    ORDER BY id DESC
  `,
  values: edgeId ? [userId, USER_MESSAGES_FETCH_LIMIT, edgeId] : [userId, USER_MESSAGES_FETCH_LIMIT],
});

export const queryFetchUserSavedMessages = (userId: string, edgeId?: string): QueryConfig => ({
  text: `
    SELECT
      id,
      body,
      created_at
    FROM user_saved_messages
    WHERE user_id = $1
    ${edgeId ? 'AND id < $2' : ''}
    ORDER BY id DESC
  `,
  values: edgeId ? [userId, edgeId] : [userId],
});

export const queryFetchNewUserMessages = (messageIds: Array<string>, recipientId: string): QueryConfig => ({
  text: `
    SELECT user_messages.id, 
      user_messages.sender_id, 
      user_messages.recipient_id, 
      user_messages.teaser, 
      user_messages.created_at,
      user_messages.read,
      users.username, 
      users.thumbnail
    FROM user_messages
    LEFT JOIN users ON users.id = user_messages.sender_id
    WHERE user_messages.id = ANY($1::int[]) AND user_messages.recipient_id = $2
    ORDER BY user_messages.id DESC
  `,
  values: [messageIds, recipientId],
});

export const queryMarkUserConversationMessagesRead = (senderId: string, recipientId: string): QueryConfig => ({
  // TODO there is a room for possible improvement for marking read only that messages that user actually seen. E.g. when unread message count > fetch limit and user hasn't scrolled through all of them
  text: `
    UPDATE user_messages
    SET read = TRUE
    WHERE sender_id = $1 AND recipient_id = $2
  `,
  values: [senderId, recipientId],
});

export const queryFetchUserConversation = (
  {user_id_1, user_id_2, edgeId, fetchNew}: FetchUserConversationPayload,
  userId: string,
): QueryConfig => ({
  text: `
    SELECT id, sender_id, recipient_id, body, read, created_at
    FROM user_messages
    WHERE
        (recipient_id = $1 AND sender_id = $2 OR recipient_id = $2 AND sender_id = $1)
        AND (recipient_id = $4 OR sender_id = $4) -- Security measure; In order to restrict lookup scope only to authed user conversations
        ${edgeId ? `AND id ${fetchNew ? '>' : '<'} $5` : ''}
    ORDER BY id DESC
    LIMIT $3
  `,
  values: edgeId
    ? [user_id_1, user_id_2, USER_CONVERSATION_MESSAGES_FETCH_LIMIT, userId, edgeId]
    : [user_id_1, user_id_2, USER_CONVERSATION_MESSAGES_FETCH_LIMIT, userId],
});

export const queryUserConversationMessageStatus = (senderId: string, recipientId: string): QueryConfig => ({
  text: `
    SELECT MAX(id) AS id
    FROM user_messages
    WHERE sender_id = $1 AND recipient_id = $2 AND read = TRUE
  `,
  values: [senderId, recipientId],
});
