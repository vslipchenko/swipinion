export const hasExtension = (path: string, regex: RegExp): boolean => {
  const chunks = path.split('.');

  return regex.test(chunks[chunks.length - 1]);
};
