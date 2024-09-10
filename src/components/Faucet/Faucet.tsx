import { useState, useEffect, useMemo } from "react";
import { TezosToolkit } from "@mavrykdynamics/taquito";
import "./styled.css";

import {
  Network,
  UserContext,
  StatusContext,
  TransactionType,
  TestnetContext,
} from "../../lib/Types";
import { AddressField } from "./AddressField";
import { AmountField } from "./AmountField";
import { TransactionTypeSelect } from "./TransactionTypeSelect";
import { TokenSelect } from "./TokenSelect";
import FaucetRequestButton from "./FaucetRequestButton";
import { MyAddress } from "./MyAddress";

export type FormState = {
  tokenAmount: string;
  address: string;
  transactionType: string | null;
  selectedToken: string | null;
  isAddressError: boolean;
};

export default function Faucet({
  network,
  user,
  Tezos,
  testnet,
}: {
  network: Network;
  user: UserContext;
  Tezos: TezosToolkit;
  testnet: TestnetContext;
}) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [statusType, setStatusType] = useState<string>("");
  const [powWorker, setPowWorker] = useState<Worker | null>(null);

  const [formState, setFormState] = useState<FormState>({
    tokenAmount: "",
    address: "",
    transactionType: null,
    selectedToken: null,
    isAddressError: true,
  });

  const statusContext: StatusContext = {
    isLoading,
    setLoading,
    status,
    setStatus,
    statusType,
    setStatusType,
    powWorker,
    setPowWorker,
  };

  const readBalances = async (): Promise<void> => {
    try {
      const userBalance = await Tezos.tz.getBalance(user.userAddress);
      user.setUserBalance(userBalance.toNumber());
    } catch (error) {
      //console.log(error);
    }
  };

  const isDisabledButton = useMemo(() => {
    const {
      transactionType,
      tokenAmount,
      selectedToken,
      address,
      isAddressError,
    } = formState;
    if (transactionType === TransactionType.address)
      return (
        !address ||
        statusContext.isLoading ||
        !tokenAmount ||
        !selectedToken ||
        isAddressError
      );
    if (transactionType === TransactionType.wallet)
      return (
        !user.userAddress ||
        statusContext.isLoading ||
        !tokenAmount ||
        !selectedToken
      );
    return true;
  }, [formState, statusContext, user]);

  const requestAddress = useMemo(
    () =>
      formState.transactionType === TransactionType.address
        ? formState.address
        : user.userAddress,
    [formState, user],
  );

  useEffect(() => {
    readBalances();
  }, [isLoading]);

  return (
    <div className="faucet-main-wrapper">
      <div className="faucet-info-block">
        <h1 className="faucet-main-title">{network.name} Faucet</h1>
        <div className="faucet-info-text">
          Please note, the tokens from the Faucet are testnet tokens only.
        </div>
      </div>

      <div className="faucet-container">
        <TransactionTypeSelect
          formState={formState}
          setFormState={setFormState}
        />

        {formState.transactionType === TransactionType.address && (
          <AddressField
            status={statusContext}
            formState={formState}
            setFormState={setFormState}
          />
        )}

        {formState.transactionType === TransactionType.wallet && (
          <MyAddress network={network} user={user} testnet={testnet} />
        )}

        <TokenSelect formState={formState} setFormState={setFormState} />

        <AmountField
          formState={formState}
          setFormState={setFormState}
          status={statusContext}
        />

        <FaucetRequestButton
          formState={formState}
          disabled={isDisabledButton}
          network={network}
          address={requestAddress}
          status={statusContext}
        />
      </div>
    </div>
  );
}
