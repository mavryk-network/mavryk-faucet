import {TokenType, TransactionType} from "../../lib/Types";

export const tokensLabels = {
    [TokenType.mvrk]: 'MVRK',
};

export const transactionsLabels = {
    [TransactionType.wallet]: 'Fund Personal Account',
    [TransactionType.address]: 'Fund Any Account Address',
};