export const getNumericEnumValues = (enumerable: {[key: string]: string | number}): Array<string | number> => {
  const values = Object.values(enumerable);

  return values.slice(values.length / 2); // For key retrieval use values.slice(0, values.length / 2));
};

export const getStringEnumValues = (enumerable: {[key: string]: string | number}): Array<string | number> => {
  return Object.values(enumerable); // For key retrieval use Object.keys(enumerable);
};
