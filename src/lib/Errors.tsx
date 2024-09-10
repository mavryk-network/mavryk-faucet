const errorMessagesMap = new Map<string, string>([
  ["BeaconWalletNotInitialized", "Please synchronize your wallet."],
  ["UnknownBeaconError", "Wallet error."],
  ["MissedBlockDuringConfirmationError", "Unkown error."],
  [
    "InvalidAddressError",
    "Please synchronize your wallet or provide a valid address.",
  ],
  ["UnconfiguredSignerError", "Unknown error."],
]);

function errorMapping(pattern: string): string {
  for (let [key, value] of errorMessagesMap.entries()) {
    if (pattern.includes(key)) return value;
  }
  return pattern;
}

export { errorMapping };
