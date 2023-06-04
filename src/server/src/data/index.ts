import {Pool, QueryConfig, QueryResult, QueryResultRow} from 'pg';
import {environment} from '../environments';
import {UsersTable} from './tables/users';
import {UserOpinionsTable} from './tables/user-opinions';
import {TagsTable} from './tables/tags';
import {FollowersTable} from './tables/user-followers';
import {UserSettingsTable} from './tables/user-settings';
import {UserNotificationsTable} from './tables/user-notifications';
import {UserMessagesTable} from './tables/user-messages';
import {UserSavedMessagesTable} from './tables/user-saved-messages';
import {TransactionResult} from '../typings/data/data.interfaces';
import {UserOpinionReactionsTable} from './tables/user-opinion-reactions';
import {UserFavoriteOpinionsTable} from './tables/user-favorite-opinions';

// PostgreSQL v14
const {DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOSTNAME, DB_PORT} = environment;

const pool = new Pool({
  user: DB_USERNAME,
  host: DB_HOSTNAME,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

export const db = {
  transaction: async (...queries: Array<QueryConfig>): Promise<TransactionResult> => {
    const client = await pool.connect();

    const results: Array<QueryResult> = [];

    try {
      await client.query('BEGIN');

      for (const query of queries) {
        results.push(await client.query(query));
      }

      await client.query('COMMIT');

      return {success: true, results};
    } catch {
      await client.query('ROLLBACK');

      return {success: false, results};
    } finally {
      client.release();
    }
  },
  query: (query: string | QueryConfig, params?: Array<any>): Promise<QueryResult<QueryResultRow>> =>
    pool.query(query, params),
  close: (): Promise<void> => pool.end(),
  sync: function (): Promise<void> {
    const tables = [
      UsersTable,
      UserSettingsTable,
      UserNotificationsTable,
      UserMessagesTable,
      UserSavedMessagesTable,
      UserOpinionsTable,
      UserOpinionReactionsTable,
      UserFavoriteOpinionsTable,
      TagsTable,
      FollowersTable,
      // ... Append other tables to sync
    ];
    // Sync tables
    return new Promise((resolve, reject) => {
      tables.forEach((table, index) => {
        setTimeout(async () => {
          try {
            console.log(`Syncing "${table.name}" table`);
            return await this.query(table.query);
          } catch (error) {
            console.error(`Error happened during creation of "${table.name}": `, error);
            reject();
          }
        }, index * 500); // Delay is needed in order to prevent relation error
      });

      resolve();
    });
  },
};
