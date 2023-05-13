export type AuthClickMethod = () => void;

export type AuthClickConfiguration = {
  allowUnauthenticatedClickCount: number;
  method: AuthClickMethod;
};
