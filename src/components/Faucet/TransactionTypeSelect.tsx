import React, {useMemo} from "react";
import {CustomSelect} from "../UI/Select/select";
import {TransactionType} from "../../lib/Types";
import {transactionsLabels} from "./Faucet.const";
import {FormState} from "./Faucet";

type Props = {
    setFormState: (value: (((prevState: FormState) => FormState) | FormState)) => void
    formState: FormState
}

export function TransactionTypeSelect(props: Props) {
    const { formState, setFormState } = props;

    const transactionType = formState.transactionType;

    const currentValue = useMemo(() => transactionType ? { value: transactionType, label: transactionsLabels[transactionType]} : null, [transactionType])

    const options = useMemo(() => Object.entries(transactionsLabels).map(([value, label]) => ({value, label})), [transactionsLabels])

    return <CustomSelect
        onChange={(option) => setFormState(prevState => ({...prevState, transactionType: option.value}))}
        value={currentValue}
        placeholder="Select transaction type"
        label="Select transaction type"
        options={options} />
}