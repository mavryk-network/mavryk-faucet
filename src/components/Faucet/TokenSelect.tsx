import React, { useCallback, useMemo } from "react";
import { CustomSelect } from "../UI/Select/select";
import { tokensImages, tokensLabels } from "./Faucet.const";
import { FormState } from "./Faucet";
import { TokenType } from "~/lib/Types";
import { FormatOptionLabelMeta } from "react-select";
import Icon from "~/components/UI/Icon/Icon";

type Props = {
  setFormState: (
    value: ((prevState: FormState) => FormState) | FormState,
  ) => void;
  formState: FormState;
};

export function TokenSelect(props: Props) {
  const { formState, setFormState } = props;

  const selectedToken = formState.selectedToken;

  const currentValue = useMemo(
    () =>
      selectedToken
        ? {
            value: selectedToken,
            label: tokensLabels[selectedToken as TokenType],
          }
        : null,
    [selectedToken],
  );

  const options = useMemo(
    () =>
      Object.entries(tokensLabels).map(([value, label]) => ({ value, label })),
    [tokensLabels],
  );

  const formatTokenOptionLabel = useCallback(
    (
      option: { value: string; label: string },
      formatOptionLabelMeta: FormatOptionLabelMeta<{
        value: string;
        label: string;
      }>,
    ) => (
      <div className="select-token-option">
        <div className="select-token-option-content">
          <img
            alt={option.label}
            src={tokensImages[option.value as TokenType]}
            className="select-token-image"
          />{" "}
          {option.label}
        </div>
        {formatOptionLabelMeta.selectValue?.[0].value === option.value ? (
          <Icon icon="check" className="token-selected-icon" />
        ) : (
          ""
        )}
      </div>
    ),
    [],
  );

  return (
    <div className="token-field-wrapper">
      <CustomSelect
        onChange={(option) =>
          setFormState((prevState) => ({
            ...prevState,
            selectedToken: option?.value ?? null,
          }))
        }
        value={currentValue}
        placeholder="Select"
        label="Token"
        formatOptionLabel={formatTokenOptionLabel}
        options={options}
      />
    </div>
  );
}
