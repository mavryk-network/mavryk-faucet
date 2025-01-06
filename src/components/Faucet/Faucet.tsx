import { useState, useMemo } from "react";
import "./styled.css";

import { Network, StatusContext, TokenType } from "~/lib/Types";
import { AddressField } from "./AddressField";
import { AmountField } from "./AmountField";
import { TokenSelect } from "./TokenSelect";
import FaucetRequestButton from "./FaucetRequestButton";
import { useUserContext } from "~/providers/UserProvider/user.provider";
import { tokensLabels } from "~/components/Faucet/Faucet.const";
import Config from "~/Config";

export type FormState = {
  tokenAmount: string;
  address: string;
  selectedToken: string | null;
  isAddressError: boolean;
  isAmountError: boolean;
};

const { maxMav, maxMvn, maxUsdt } = Config.application;

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
    isAmountError: true,
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
      tokenAmount,
      selectedToken,
      address,
      isAddressError,
      isAmountError,
    } = formState;

    return (
      !address ||
      statusContext.isLoading ||
      !tokenAmount ||
      !selectedToken ||
      isAddressError ||
      isAmountError
    );
  }, [formState, statusContext, user]);

  const tokenLabel = tokensLabels[TokenType[formState.selectedToken]];
  const maxTokenAmount = useMemo(() => {
    if (formState.selectedToken === TokenType.mvrk) return maxMav;

    if (formState.selectedToken === TokenType.usdt) return maxUsdt;

    if (formState.selectedToken === TokenType.mvn) return maxMvn;

    return 100;
  }, [formState.selectedToken]);

  return (
    <div className="faucet-main-wrapper">
      <div className="faucet-info-block">
        <h1 className="faucet-main-title">{network.name} Faucet</h1>
        <div className="faucet-info-text">
          Please note, the tokens from the Faucet are testnet tokens only.
          <br />
          You can request a maximum of {maxTokenAmount} {tokenLabel} tokens
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
