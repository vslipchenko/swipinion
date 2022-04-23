import {Pool, QueryConfig, QueryResult} from 'pg';
import {environment} from '../environments';

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
  query: <T>(query: string | QueryConfig, params?: Array<any>): Promise<QueryResult<T>> => pool.query(query, params),
  close: (): Promise<void> => pool.end(),
  sync: function (): Promise<void> {
    const tables = [
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
