export type QueryPayloadParameters<T> = {[key in keyof T]: string};
export type RawQueryPayload<T> = T extends {[key: string]: string | number | undefined | null} ? T : never;
export type QueryPayloadValues = Array<unknown>;
export type QueryPayload<T> = {parameters: QueryPayloadParameters<T>; values: QueryPayloadValues};
