import React, {useMemo} from "react";
import {CustomSelect} from "../UI/Select/select";
import {TokenType} from "../../lib/Types";
import {tokensLabels} from "./Faucet.const";

type Props = {
    setSelectedToken: (value: (((prevState: (TokenType | null)) => (TokenType | null)) | TokenType | null)) => void
    selectedToken: string | null
}

export function TokenSelect(props: Props) {
    const { selectedToken, setSelectedToken } = props;

    const currentValue = useMemo(() => selectedToken ? { value: selectedToken, label: tokensLabels[selectedToken]} : null, [selectedToken])

    const options = useMemo(() => Object.entries(tokensLabels).map(([value, label]) => ({value, label})), [tokensLabels])

    return <CustomSelect
        onChange={(option) => setSelectedToken(option.value)}
        value={currentValue}
        placeholder="Select token"
        label="Select token"
        options={options} />
}