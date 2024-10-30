import { useState, useMemo } from "react";
import "./styled.css";

import {
  Network,
  StatusContext,
  TokenType,
} from "~/lib/Types";
import { AddressField } from "./AddressField";
import { AmountField } from "./AmountField";
import { TokenSelect } from "./TokenSelect";
import FaucetRequestButton from "./FaucetRequestButton";
import { useUserContext } from "~/providers/UserProvider/user.provider";

export type FormState = {
  tokenAmount: string;
  address: string;
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
    selectedToken: TokenType.mvrk,
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
    const { tokenAmount, selectedToken, address, isAddressError } = formState;

    return (
      !address ||
      statusContext.isLoading ||
      !tokenAmount ||
      !selectedToken ||
      isAddressError
    );
  }, [formState, statusContext, user]);

  return (
    <div className="faucet-main-wrapper">
      <div className="faucet-info-block">
        <h1 className="faucet-main-title">{network.name} Faucet</h1>
        <div className="faucet-info-text">
          Please note, the tokens from the Faucet are testnet tokens only.
          <br />
          You can request a maximum of 6,000 MVRK tokens
        </div>
      </div>

      <div className="faucet-container">
        <AddressField
          status={statusContext}
          formState={formState}
          setFormState={setFormState}
        />

        <div className={"faucet-amount-container"}>
          <TokenSelect formState={formState} setFormState={setFormState} />

          <AmountField
            formState={formState}
            setFormState={setFormState}
            status={statusContext}
          />
        </div>

        <FaucetRequestButton
          formState={formState}
          disabled={isDisabledButton}
          network={network}
          status={statusContext}
        />
      </div>
    </div>
  );
}
