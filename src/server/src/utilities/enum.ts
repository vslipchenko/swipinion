export const getStringEnumValues = (enumerable: {[key: string]: string | number}): Array<string | number> => {
  return Object.values(enumerable); // For key retrieval use Object.keys(enumerable);
};
