import React, { ChangeEvent, useCallback } from "react";
import { validateKeyHash } from "@mavrykdynamics/taquito-utils";
import { StatusContext } from "~/lib/Types";
import { autoSelectInputText } from "~/lib/Utils";
import { Input } from "../UI/Input/Input";
import { FormState } from "./Faucet";
import WalletIcon from "~/icons/glyphs/WalletIcon";
import { useUserContext } from "~/providers/UserProvider/user.provider";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

type Props = {
  status: StatusContext;
  setFormState: (
    value: ((prevState: FormState) => FormState) | FormState,
  ) => void;
  formState: FormState;
};

const CustomTooltip = <Tooltip id="tooltip">Fill in my wallet address</Tooltip>;

export function AddressField(props: Props) {
  const { setFormState, formState, status } = props;

  const { user } = useUserContext();

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;

    setFormState((prevState) => ({
      ...prevState,
      address: value,
      isAddressError: !(value.length === 0 || validateKeyHash(value) === 3),
    }));
  }, []);

  const setWalletAddress = useCallback(() => {
    if (!user) return;
    setFormState((prevState) => ({
      ...prevState,
      address: user.address as string,
      isAddressError: false,
    }));
  }, [setFormState, user]);

  return (
    <div className="address-field-wrapper">
      <Input
        isClearable
        label="Wallet Address"
        placeholder="Enter Address"
        disabled={status.isLoading}
        onChange={handleInput}
        value={formState.address}
        error={formState.isAddressError ? "Invalid address" : ""}
        onClick={autoSelectInputText}
      />
      {user?.address && !formState.address && (
        <div className="address-field-wallet" onClick={setWalletAddress}>
          <OverlayTrigger placement="top" overlay={CustomTooltip}>
            <WalletIcon />
          </OverlayTrigger>
        </div>
      )}
    </div>
  );
}
