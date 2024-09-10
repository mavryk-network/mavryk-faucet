import React, {useCallback, useMemo} from "react";
import {CustomSelect} from "../UI/Select/select";
import {tokensImages, tokensLabels} from "./Faucet.const";
import {FormState} from "./Faucet";

type Props = {
    setFormState: (value: (((prevState: FormState) => FormState) | FormState)) => void
    formState: FormState
}

export function TokenSelect(props: Props) {
    const { formState, setFormState } = props;

    const selectedToken = formState.selectedToken;

    const currentValue = useMemo(() => selectedToken ? { value: selectedToken, label: tokensLabels[selectedToken]} : null, [selectedToken])

    const options = useMemo(() => Object.entries(tokensLabels).map(([value, label]) => ({value, label})), [tokensLabels])

    const formatTokenOptionLabel = useCallback(
        (option: { value: string; label: string }) => <div className="select-token-option">
           <img alt={option.label} src={tokensImages[option.value]} className="select-token-image" /> {option.label}
        </div>,
        [],
    );

    return <CustomSelect
        onChange={(option) => setFormState(prevState => ({...prevState, selectedToken: option.value}))}
        value={currentValue}
        placeholder="Select token"
        label="Select token"
        formatOptionLabel={formatTokenOptionLabel}
        options={options} />
}