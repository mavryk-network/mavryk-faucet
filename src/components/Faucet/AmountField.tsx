import React, {useMemo} from "react";
import {StatusContext} from "../../lib/Types";
import {autoSelectInputText} from "../../lib/Utils";
import {Input} from "../UI/Input/Input";
import Config from "../../Config";
import {tokensLabels} from "./Faucet.const";

const { minMav, maxMav } = Config.application

type Props = {
    amount: number
    status: StatusContext
    setAmount: (amount: number) => void
    selectedToken: string | null;
}

export function AmountField(props: Props) {
    const {amount, status, setAmount, selectedToken } = props;

    const validateAmount = (amount: number) =>
        amount >= minMav && amount <= maxMav

    const updateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value.slice(0, 16))
        if (value === 0 || validateAmount(value)) {
            setAmount(value)
        }
    }

    const tokenName = useMemo(() => tokensLabels[selectedToken] ?? 'token', [selectedToken])

    return <Input
        type="number"
        min={minMav}
        max={maxMav}
        value={amount}
        label={`Enter ${tokenName} amount`}
        subLabel={selectedToken ? `Please note that you can request a maximum of 6000 ${tokenName} tokens`: ""}
        placeholder={`Enter ${tokenName} amount`}
        disabled={status.isLoading}
        onChange={updateAmount}
        onClick={autoSelectInputText}
    />
}