import React, {useMemo} from "react";
import {CustomSelect} from "../UI/Select/select";
import {TransactionType} from "../../lib/Types";
import {transactionsLabels} from "./Faucet.const";

type Props = {
    setTransactionType: (value: (((prevState: (TransactionType | null)) => (TransactionType | null)) | TransactionType | null)) => void
    transactionType: TransactionType | null
}

export function TransactionTypeSelect(props: Props) {
    const { transactionType, setTransactionType } = props;

    const currentValue = useMemo(() => transactionType ? { value: transactionType, label: transactionsLabels[transactionType]} : null, [transactionType])

    const options = useMemo(() => Object.entries(transactionsLabels).map(([value, label]) => ({value, label})), [transactionsLabels])

    return <CustomSelect
        onChange={(option) => setTransactionType(option.value)}
        value={currentValue}
        placeholder="Select transaction type"
        label="Select transaction type"
        options={options} />
}