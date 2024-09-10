import React, {ChangeEvent, useCallback, useState} from "react";
import {validateKeyHash} from "@mavrykdynamics/taquito-utils";
import {StatusContext} from "../../lib/Types";
import {autoSelectInputText} from "../../lib/Utils";
import {Input} from "../UI/Input/Input";
import {Alert} from "../UI/Alert/alert";

type Props = {
    status: StatusContext
    inputToAddr: any
    setInputToAddr: any
}

export function AddressField(props: Props) {
    const {setInputToAddr, inputToAddr, status } = props;

    const [addressError, setAddressError] = useState(false);

    const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const value: string = event.target.value

        setInputToAddr(value)
        setAddressError(!(value.length === 0 || validateKeyHash(value) === 3));
    }, []);

    return <div className="address-field-wrapper">
        <Alert title="Attention!" message="Make sure you are funding the correct account address." />
        <Input
        label="Enter address"
        subLabel="Please note that you can also fund a contract address"
        placeholder="mv1..."
        disabled={status.isLoading}
        onChange={handleInput}
        value={inputToAddr}
        error={addressError ? 'Invalid address' : ''}
        onClick={autoSelectInputText}
    /></div>
}