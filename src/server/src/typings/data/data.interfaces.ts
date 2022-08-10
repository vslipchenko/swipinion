import {QueryResult} from 'pg';

export interface Table {
  name: string;
  query: string;
}

export interface TransactionResult {
  success: boolean;
  results: Array<QueryResult>;
}