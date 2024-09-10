import React, {useMemo} from "react";
import {StatusContext} from "../../lib/Types";
import {autoSelectInputText} from "../../lib/Utils";
import {Input} from "../UI/Input/Input";
import Config from "../../Config";
import {tokensLabels} from "./Faucet.const";
import {formatNumber} from "../../utils/formaters";
import {FormState} from "./Faucet";

const { minMav, maxMav } = Config.application

type Props = {
    status: StatusContext
    setFormState: (value: (((prevState: FormState) => FormState) | FormState)) => void
    formState: FormState
}

export function AmountField(props: Props) {
    const {status, setFormState, formState } = props;

    const validateAmount = (amount: number) =>
        amount >= minMav && amount <= maxMav

    const updateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.slice(0, 16);
        const numberValue = Number(value)
        if (numberValue === 0 || validateAmount(numberValue)) {
            setFormState(prevState => ({...prevState, tokenAmount: value}))
        }
    }

    const tokenName = useMemo(() => tokensLabels[formState.selectedToken] ?? 'token', [formState.selectedToken])

    return <Input
        type="number"
        min={minMav}
        max={maxMav}
        value={formState.tokenAmount}
        label={`Enter ${tokenName} amount`}
        subLabel={formState.selectedToken ? `Please note that you can request a maximum of ${formatNumber({number: maxMav})} ${tokenName} tokens`: ""}
        placeholder={`Enter ${tokenName} amount`}
        disabled={status.isLoading}
        onChange={updateAmount}
        onClick={autoSelectInputText}
    />
}