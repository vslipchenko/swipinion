export const insertCommaAtPosition = (value: string, position: number): string => {
  return value.replace(RegExp(`(?<=^.{${position}})`), ',');
};
