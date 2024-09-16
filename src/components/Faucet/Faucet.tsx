import { useState, useMemo } from "react";
import "./styled.css";

import { Network, StatusContext, TransactionType } from "../../lib/Types";
import { AddressField } from "./AddressField";
import { AmountField } from "./AmountField";
import { TransactionTypeSelect } from "./TransactionTypeSelect";
import { TokenSelect } from "./TokenSelect";
import FaucetRequestButton from "./FaucetRequestButton";
import { MyAddress } from "./MyAddress";
import { useUserContext } from "../../providers/UserProvider/user.provider";

export type FormState = {
  tokenAmount: string;
  address: string;
  transactionType: string | null;
  selectedToken: string | null;
  isAddressError: boolean;
};

export default function Faucet({ network }: { network: Network }) {
  const { user } = useUserContext();
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
        !user.address ||
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
        : (user.address ?? ""),
    [formState, user],
  );

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

        {formState.transactionType === TransactionType.wallet && <MyAddress />}

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
          transactionType={formState.transactionType}
        />
      </div>
    </div>
  );
}
