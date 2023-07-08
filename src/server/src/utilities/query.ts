import {QueryPayload, QueryPayloadParameters, QueryPayloadValues, RawQueryPayload} from '../typings/query/query.types';

export const composeQueryPayload = <T>(
  payload: RawQueryPayload<T>,
  invalidValues: Array<undefined> = [undefined], // Filter out 'undefined' values by default (values have to be primitives and not references)
): QueryPayload<T> => {
  let parameterIndex = 1;
  const parameters: QueryPayloadParameters<any> = {};
  const values: QueryPayloadValues = [];

  for (const [key, value] of Object.entries(payload)) {
    if (invalidValues.includes(value as undefined)) continue;

    parameters[key] = '$' + parameterIndex;

    values.push(value);

    parameterIndex++;
  }

  return {
    parameters,
    values,
  };
};
