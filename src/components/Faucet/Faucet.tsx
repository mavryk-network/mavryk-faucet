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
const DEFAULT_MAX_MVRK = 1000;
const mvnTokenAddress = "KT1WdbBw5DXF9fXN378v8VgrPqTsCKu2BPgD";
const usdtTokenAddress = "KT1StUZzJ34MhSNjkQMSyvZVrR9ppkHMFdFf";
const mvrkTokenAddress = "mv2ZZZZZZZZZZZZZZZZZZZZZZZZZZZDXMF2d";

const fromMvn = (amount: number) => amount / 10 ** 9;
const fromUsdt = (amount: number) => amount / 10 ** 6;
const fromMvrk = (amount: number) => amount / 10 ** 6;

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
    minMvrk: 1,
    maxMvrk: DEFAULT_MAX_MVRK,
  });

  const [formState, setFormState] = useState<FormState>({
    tokenAmount: "",
    address: "",
    selectedToken: TokenType.mvrk,
    isAddressError: true,
    isAmountError: false,
  });

  const getContractBigmap = useCallback(async () => {
    const { data }: { data: { key?: { address: string }; value: number }[] } =
      await api.get(
        `${apiMavrykUrl}/bigmaps/keys?bigmap=5394&sort.desc=lastLevel`,
      );

    const usdt = data.find(
      (item) => item.key?.address === usdtTokenAddress,
    )?.value;
    const mvn = data.find(
      (item) => item.key?.address === mvnTokenAddress,
    )?.value;
    const mvrk = data.find(
      (item) => item.key?.address === mvrkTokenAddress,
    )?.value;

    const maxUsdt = usdt ? fromUsdt(usdt) : DEFAULT_MAX_USDT;
    const maxMvn = mvn ? fromMvn(mvn) : DEFAULT_MAX_MVN;
    const maxMvrk = mvrk ? fromMvrk(mvrk) : DEFAULT_MAX_MVRK;

    setTokenState((prevState) => ({ ...prevState, maxUsdt, maxMvn, maxMvrk }));
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
    const { selectedToken, address, isAddressError } = formState;

    return (
      !address || statusContext.isLoading || !selectedToken || isAddressError
    );
  }, [formState, statusContext, user]);

  const tokenLabel =
    tokensLabels[TokenType[formState.selectedToken as TokenType]];

  const maxTokenAmount = useMemo(() => {
    if (formState.selectedToken === TokenType.mvrk) return tokenState.maxMvrk;

    if (formState.selectedToken === TokenType.usdt) return tokenState.maxUsdt;

    if (formState.selectedToken === TokenType.mvn) return tokenState.maxMvn;

    return 100;
  }, [formState.selectedToken, tokenState]);

  return (
    <div className="faucet-main-wrapper">
      <div className="faucet-info-block">
        <h1 className="faucet-main-title">{network.name} Faucet</h1>
        <div className="faucet-info-text">
          Please note, the tokens from the Faucet are testnet tokens only. You
          will receive the amount straight to the address.
        </div>
      </div>

      <div className="faucet-container">
        <div className="faucet-container-content">
          <div className={"faucet-amount-container"}>
            <TokenSelect formState={formState} setFormState={setFormState} />

            <AddressField
              status={statusContext}
              formState={formState}
              setFormState={setFormState}
            />
          </div>

          <div className="faucet-token-amount">
            You will receive{" "}
            <span className="faucet-token-amount-bold">
              {maxTokenAmount.toLocaleString("en-US")} {tokenLabel}
            </span>
          </div>
        </div>

        <FaucetRequestButton
          formState={formState}
          disabled={isDisabledButton}
          network={network}
          maxTokenAmount={maxTokenAmount}
          status={statusContext}
        />
      </div>
    </div>
  );
}
