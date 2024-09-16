// Context types
export type UserContext = {
  isLoading: boolean;
  changeUser: () => Promise<void>;
  signOut: () => Promise<void>;
  user: { address: string | undefined; balance: number };
  connect: () => Promise<void>;
  readBalances: () => Promise<void>;
};
