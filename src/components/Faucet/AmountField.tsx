import React, { useEffect } from "react";
import { StatusContext, TokenType } from "~/lib/Types";
import { autoSelectInputText } from "~/lib/Utils";
import { Input } from "../UI/Input/Input";
import Config from "../../Config";
import { formatInputToDecimalNumber } from "~/utils/formaters";
import { FormState } from "./Faucet";

const { minMav, maxMav } = Config.application;

type Props = {
  status: StatusContext;
  setFormState: (
    value: ((prevState: FormState) => FormState) | FormState,
  ) => void;
  formState: FormState;
  tokenState: {
    minUsdt: number;
    maxUsdt: number;
    minMvn: number;
    maxMvn: number;
  };
};

export function AmountField(props: Props) {
  const { status, setFormState, formState, tokenState } = props;

  const validateAmount = (amount: number) => {
    if (formState.selectedToken === TokenType.mvrk)
      return amount >= minMav && amount <= maxMav;

    if (formState.selectedToken === TokenType.usdt)
      return amount >= tokenState.minUsdt && amount <= tokenState.maxUsdt;

    if (formState.selectedToken === TokenType.mvn)
      return amount >= tokenState.minMvn && amount <= tokenState.maxMvn;

    return false;
  };

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      isAmountError: !validateAmount(Number(formState.tokenAmount)),
    }));
  }, [formState.selectedToken]);

  const updateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numberValue = Number(value);

    setFormState((prevState) => ({
      ...prevState,
      isAmountError: !validateAmount(numberValue),
      tokenAmount: formatInputToDecimalNumber(value),
    }));
  };

  return (
    <div className="amount-field-wrapper">
      <Input
        isClearable
        type="number"
        min={minMav}
        max={maxMav}
        value={formState.tokenAmount}
        error={
          formState.isAmountError && formState.tokenAmount
            ? "Invalid amount"
            : ""
        }
        label={`Token Amount`}
        placeholder={`Enter Amount`}
        disabled={status.isLoading}
        onChange={updateAmount}
        onClick={autoSelectInputText}
      />
    </div>
  );
}
