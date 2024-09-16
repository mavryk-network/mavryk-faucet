import { useCallback, useMemo } from "react";
import { dappClient } from "../../WalletProvider/WalletCore.client";

type UseUserApiType = {
  DAPP_INSTANCE: ReturnType<typeof dappClient> | null;
  // setters for loadings in user provider
  setUserLoading: (newLoading: boolean) => void;
  setUserBalance: (value: ((prevState: number) => number) | number) => void;
  setAccount: (value: ((prevState: number) => number) | number) => void;
};

/**
 * hook to handle CRUD with user (connect, changeWallet, signOut)
 *
 * SHOULD BE USED ONLY IN UserProvider
 */
export const useUserApi = ({
  DAPP_INSTANCE,
  setUserLoading,
  setUserBalance,
  setAccount,
}: UseUserApiType) => {
  /**
   * connect user's wallet to DAPP:
   * load tzkt balances and set user's address to ctx (inside loadInitialTzktTokensForNewlyConnectedUser) to make QueryWithRefetch work
   */
  const connect = useCallback(async () => {
    try {
      await DAPP_INSTANCE?.connectAccount();
      DAPP_INSTANCE?.getDAppClient();
    } catch (e) {
      setUserLoading(false);
      console.error(`Failed to connect wallet:`, e);
      // bug('Failed to connect wallet', TOASTER_TEXTS[TOASTER_SUBSCRIPTION_ERROR]['title'])
    }
  }, [DAPP_INSTANCE, setUserLoading]);

  const changeUser = useCallback(async () => {
    try {
      await DAPP_INSTANCE?.connectAccount();
    } catch (e) {
      console.error(`Failed to change wallet: `, e);
    }
  }, [DAPP_INSTANCE]);

  /**
   * disconnect user's wallet to DAPP & set context to no user state
   */
  const signOut = useCallback(async () => {
    try {
      await DAPP_INSTANCE?.disconnectWallet();
      setUserBalance(0);
      setAccount(null);
    } catch (e) {
      console.error(`Failed to disconnect wallet: `, e);
      // bug(
      //   'Failed to disconnect wallet',
      //   TOASTER_TEXTS[TOASTER_SUBSCRIPTION_ERROR]['title']
      // );
    }
  }, [DAPP_INSTANCE, setUserBalance]);

  const returnValue = useMemo(
    () => ({
      connect,
      signOut,
      changeUser,
    }),
    [connect, signOut, changeUser],
  );

  return returnValue;
};
