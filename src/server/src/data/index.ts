import {Pool, QueryConfig, QueryResult} from 'pg';
import {environment} from '../environments';
import {UsersTable} from './tables/users';
import {OpinionsTable} from './tables/opinions';
import {TagsTable} from './tables/tags';
import {FollowersTable} from './tables/followers';
import {UserSettingsTable} from './tables/user-settings';
import {UserNotificationsTable} from './tables/user-notifications';
import {SuccessResponse} from '../typings/response/response.interfaces';

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
  transaction: async (...queries: Array<QueryConfig>): Promise<SuccessResponse> => {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (const query of queries) {
        await client.query(query);
      }

      await client.query('COMMIT');

      return {success: true};
    } catch {
      await client.query('ROLLBACK');

      return {success: false};
    } finally {
      client.release();
    }
  },
  query: <T>(query: string | QueryConfig, params?: Array<any>): Promise<QueryResult<T>> => pool.query(query, params),
  close: (): Promise<void> => pool.end(),
  sync: function (): Promise<void> {
    const tables = [
      UsersTable,
      UserNotificationsTable,
      UserSettingsTable,
      OpinionsTable,
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
