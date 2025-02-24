import { useState, useMemo, useCallback, useEffect } from "react";
import "./styled.css";

import {
  ChallengeResponse,
  Network,
  StatusContext,
  TokenType,
} from "~/lib/Types";
import { AddressField } from "./AddressField";
import { AmountField } from "./AmountField";
import { TokenSelect } from "./TokenSelect";
import FaucetRequestButton, { api } from "./FaucetRequestButton";
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

const { maxMav, apiMavrykUrl } = Config.application;

const DEFAULT_MAX_USDT = 1000;
const DEFAULT_MAX_MVN = 1000;
const mvnTokenAddress = "KT1WdbBw5DXF9fXN378v8VgrPqTsCKu2BPgD";
const usdtTokenAddress = "KT1StUZzJ34MhSNjkQMSyvZVrR9ppkHMFdFf";

const fromMvn = (amount: number) => amount / 10 ** 9;
const fromUsdt = (amount: number) => amount / 10 ** 6;

export default function Faucet({ network }: { network: Network }) {
  const { user } = useUserContext();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [statusType, setStatusType] = useState<string>("");
  const [powWorker, setPowWorker] = useState<Worker | null>(null);
  const [tokenState, setTokenState] = useState({
    minUsdt: 1,
    maxUsdt: DEFAULT_MAX_USDT,
    minMvn: 1,
    maxMvn: DEFAULT_MAX_MVN,
  });

  const [formState, setFormState] = useState<FormState>({
    tokenAmount: "",
    address: "",
    selectedToken: TokenType.mvrk,
    isAddressError: true,
    isAmountError: true,
  });

  // const getContractBigmap = useCallback(async () => {
  //   const { data }: { data: { key?: { address: string }; value: number }[] } =
  //     await api.get(
  //       `${apiMavrykUrl}/bigmaps/keys?bigmap=5169&sort.desc=lastLevel`,
  //     );
  //
  //   const usdt = data.find(
  //     (item) => item.key?.address === usdtTokenAddress,
  //   )?.value;
  //   const mvn = data.find(
  //     (item) => item.key?.address === mvnTokenAddress,
  //   )?.value;
  //
  //   const maxUsdt = usdt ? fromUsdt(usdt) : DEFAULT_MAX_USDT;
  //   const maxMvn = mvn ? fromMvn(mvn) : DEFAULT_MAX_MVN;
  //
  //   setTokenState((prevState) => ({ ...prevState, maxUsdt, maxMvn }));
  // }, [apiMavrykUrl]);

  const getContractBigmap = useCallback(async () => {
    const maxUsdt = DEFAULT_MAX_USDT;
    const maxMvn = DEFAULT_MAX_MVN;

    setTokenState((prevState) => ({ ...prevState, maxUsdt, maxMvn }));
  }, [apiMavrykUrl]);

  useEffect(() => {
    getContractBigmap();
  }, []);

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

  const tokenLabel =
    tokensLabels[TokenType[formState.selectedToken as TokenType]];

  const maxTokenAmount = useMemo(() => {
    if (formState.selectedToken === TokenType.mvrk) return maxMav;

    if (formState.selectedToken === TokenType.usdt) return tokenState.maxUsdt;

    if (formState.selectedToken === TokenType.mvn) return tokenState.maxMvn;

    return 100;
  }, [formState.selectedToken, tokenState]);

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
            tokenState={tokenState}
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
