import React, { ChangeEvent, MouseEvent, useMemo, useState } from "react";
import "./input.css";
import classnames from "classnames";
import CloseIcon from "~/icons/glyphs/CloseIcon";

type Props = {
  label?: string;
  subLabel?: string;
  value: string | number;
  placeholder?: string;
  onChange: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined;
  error?: string;
  disabled?: boolean;
  isClearable?: boolean;
  type?: string;
  min?: number | string;
  max?: number | string;
  id?: string;
  onClick?: ((event: MouseEvent) => void) | undefined;
};

export function Input(props: Props) {
  const {
    label,
    type,
    id,
    value,
    error,
    onChange,
    placeholder,
    disabled,
    subLabel,
    min,
    max,
    isClearable,
    onClick,
  } = props;

  const [isBlur, setIsBlur] = useState(false);

  const isError = useMemo(() => isBlur && error, [error, isBlur]);

  return (
    <div className="custom-input-wrapper">
      {label || subLabel ? (
        <div className="custom-input-label-container">
          {label && <span className="custom-input-label">{label}</span>}
          {subLabel && (
            <span className="custom-input-sub-label">{subLabel}</span>
          )}
        </div>
      ) : null}

      <input
        onBlur={() => setIsBlur(true)}
        id={id}
        onClick={onClick}
        min={min}
        max={max}
        type={type}
        className={classnames("custom-input", {
          ["custom-input-error"]: isError,
        })}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {isClearable && value && (
        <span
          className="custom-input-clear-icon"
          onClick={() => {
            if (onChange)
              onChange({
                target: { value: "" },
              } as ChangeEvent<HTMLInputElement>);
          }}
        >
          <CloseIcon />
        </span>
      )}
      {isError && <span className="custom-input-error-text">{error}</span>}
    </div>
  );
}
