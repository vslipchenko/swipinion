import {QueryConfig} from 'pg';
import {PrivacyCommonSettings} from '../../typings/user-settings/user-settings.enums';

export const querySendUserMessage = (senderId: string, receiverId: string, body: string): QueryConfig => ({
  text: `
    INSERT INTO user_messages (receiver_id, sender_id, body)
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
      $3
    )
  `,
  values: [senderId, receiverId, body],
});
