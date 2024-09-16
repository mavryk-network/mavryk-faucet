import {FC, createContext, useEffect, useState, useContext, PropsWithChildren} from 'react';
import { dappClient } from './WalletCore.client';

type WalletContext = {
  dapp: ReturnType<typeof dappClient> | null;
  isLoading: boolean;
};

export const walletContext = createContext<WalletContext>(undefined!);

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletContext>({
    dapp: null,
    isLoading: true,
  });

  useEffect(() => {
    const dapp = dappClient();
    setWalletState({ dapp, isLoading: false });
  }, []);

  return (
    <walletContext.Provider value={walletState}>
      {children}
    </walletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(walletContext);

  if (!context) {
    throw new Error('walletContext should be used within WalletProvider');
  }

  return context;
};
