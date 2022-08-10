import {QueryConfig} from 'pg';
import {PrivacyCommonSettings} from '../../typings/user-settings/user-settings.enums';
import {USER_CHAT_MESSAGES_FETCH_LIMIT, USER_MESSAGES_FETCH_LIMIT} from '../../constants/user-messages';

export const querySendUserMessage = (
  senderId: string,
  receiverId: string,
  body: string,
  teaser: string,
): QueryConfig => ({
  text: `
    INSERT INTO user_messages (receiver_id, sender_id, body, teaser)
    VALUES (
      (
        SELECT user_settings.user_id
        FROM   user_settings
               LEFT JOIN user_followers
                      ON user_settings.user_id = user_followers.user_id
        WHERE  user_settings.user_id = $2 
               AND user_settings.message != ${PrivacyCommonSettings.NoOne}       -- Check whether messaging is disabled on behalf of receiver
               AND user_settings.message = ${PrivacyCommonSettings.Everyone}     -- Check whether messaging is allowed to everyone
                OR user_followers.follower_id = $1                               -- If messaging is allowed only for followers; check whether sender has accepted following
                   AND user_followers.pending IS FALSE
      ),
      $1,
      $3,
      $4
    )
  `,
  values: [senderId, receiverId, body, teaser],
});

export const queryFetchUserMessages = (userId: string, edgeId?: number): QueryConfig => ({
  text: `
    SELECT conversations.conversation_id AS id, 
      conversations.greatest AS user_id_1, 
      conversations.least AS user_id_2, 
      user_messages.created_at, 
      user_messages.teaser,
      users.username, 
      users.thumbnail
    FROM 
    (
      SELECT DISTINCT GREATEST(sender_id, receiver_id), LEAST(sender_id, receiver_id), MAX(id) AS conversation_id
      FROM user_messages
      WHERE sender_id = $1
        OR receiver_id = $1
      GROUP BY GREATEST(sender_id, receiver_id), LEAST(sender_id, receiver_id)
      ${edgeId ? 'HAVING MAX(id) < $3' : ''}
      ORDER BY conversation_id DESC
      LIMIT $2
    ) AS conversations
    LEFT JOIN user_messages ON  user_messages.id = conversations.conversation_id
    LEFT JOIN users ON (users.id = user_messages.receiver_id OR users.id = user_messages.sender_id) AND users.id != $1
    ORDER BY id DESC
  `,
  values: edgeId ? [userId, USER_MESSAGES_FETCH_LIMIT, edgeId] : [userId, USER_MESSAGES_FETCH_LIMIT],
});

export const queryMarkUserMessagesRead = (senderId: string, receiverId: string): QueryConfig => ({
  // TODO there is a room for possible improvement for marking read only that messages that user actually seen. E.g. when unread message count > fetch limit and user hasn't scrolled through all of them
  text: `
    UPDATE user_messages
    SET read = TRUE
    WHERE sender_id = $1 AND receiver_id = $2
  `,
  values: [senderId, receiverId],
});

export const queryFetchUserChat = (user_id_1: string, user_id_2: string, startDate: string): QueryConfig => ({
  text: `
    SELECT sender_id, receiver_id, body, created_at
    FROM user_messages
    WHERE
        receiver_id = $1 AND sender_id = $2
        OR receiver_id = $2 AND sender_id = $1
        AND created_at <= $3
    ORDER BY created_at DESC
    LIMIT $4
  `,
  values: [user_id_1, user_id_2, startDate, USER_CHAT_MESSAGES_FETCH_LIMIT],
});
