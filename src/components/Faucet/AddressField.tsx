import React, { ChangeEvent, useCallback } from "react";
import { validateKeyHash } from "@mavrykdynamics/taquito-utils";
import { StatusContext } from "../../lib/Types";
import { autoSelectInputText } from "../../lib/Utils";
import { Input } from "../UI/Input/Input";
import { Alert } from "../UI/Alert/alert";
import { FormState } from "./Faucet";

type Props = {
  status: StatusContext;
  setFormState: (
    value: ((prevState: FormState) => FormState) | FormState,
  ) => void;
  formState: FormState;
};

export function AddressField(props: Props) {
  const { setFormState, formState, status } = props;

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;

    setFormState((prevState) => ({
      ...prevState,
      address: value,
      isAddressError: !(value.length === 0 || validateKeyHash(value) === 3),
    }));
  }, []);

  return (
    <div className="address-field-wrapper">
      <Alert
        title="Attention!"
        message="Make sure you are funding the correct account address."
      />
      <Input
        label="Enter address"
        subLabel="Please note that you can also fund a contract address"
        placeholder="mv1..."
        disabled={status.isLoading}
        onChange={handleInput}
        value={formState.address}
        error={formState.isAddressError ? "Invalid address" : ""}
        onClick={autoSelectInputText}
      />
    </div>
  );
}
