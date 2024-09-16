import React, { useContext, useEffect, useMemo, useState } from "react";

// hooks
import { useUserApi } from "./hooks/useUserApi";

import { UserContext } from "./user.provider.types";
import { useWalletContext } from "../WalletProvider/wallet.provider";
import { AccountInfo } from "@mavrykdynamics/beacon-dapp";
import { TezosToolkit } from "@mavrykdynamics/taquito";
import Config from "../../Config";

export const userContext = React.createContext<UserContext>(undefined!);

type Props = {
  children: React.ReactNode;
};

/**
 * ADJUSTMENTS:
 * 1. on changing user do not reopen socket, just update filter (invoke), currently hadn't found any example of it
 */
export const UserProvider = ({ children }: Props) => {
  const { dapp } = useWalletContext();

  const [account, setAccount] = useState<AccountInfo | null | undefined>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [isUserLoading, setUserLoading] = useState(true);

  const { connect, signOut, changeUser } = useUserApi({
    DAPP_INSTANCE: dapp,
    setUserLoading,
    setUserBalance,
    setAccount,
  });

  const readBalances = async (): Promise<void> => {
    try {
      if (!account?.address) return;
      console.log("HEEEERE,", account);
      const Tezos = new TezosToolkit(Config.network.rpcUrl);
      const balance = await Tezos.tz.getBalance(account.address);
      setUserBalance(balance.toNumber());
    } catch (error) {
      //console.log(error);
    }
  };

  // Listening for active account changes with beacon
  useEffect(() => {
    (async function () {
      try {
        // if no account, event to listen for active acc is not triggered, so we manually set acc to null
        const acc = await dapp?.getDAppClient().getActiveAccount();
        if (!acc) setAccount(null);

        dapp?.listenToActiveAccount(setAccount);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [dapp]);

  useEffect(() => {
    readBalances();
  }, [account?.address]);

  const providerValue = useMemo(() => {
    const isLoading = isUserLoading;

    return {
      isLoading,
      connect,
      signOut,
      changeUser,
      readBalances,
      user: {
        address: account?.address,
        balance: userBalance,
      },
    };
  }, [isUserLoading, connect, signOut, changeUser, account, userBalance]);

  return (
    <userContext.Provider value={providerValue}>
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(userContext);

  if (!context) {
    throw new Error("userContext should be used within UserProvider");
  }

  return context;
};

export default UserProvider;
