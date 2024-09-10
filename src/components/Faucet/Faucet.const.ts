import { TokenType, TransactionType } from "../../lib/Types";

export const tokensLabels = {
  [TokenType.mvrk]: "MVRK",
};

export const tokensImages = {
  [TokenType.mvrk]: "/assets/mvrk.png",
};

export const transactionsLabels = {
  [TransactionType.wallet]: "Fund Personal Account",
  [TransactionType.address]: "Fund Any Account Address",
};
