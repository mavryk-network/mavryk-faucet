import classnames from "classnames";
import React, { useState } from "react";
import "./button.css";
import { CustomSpinner } from "~/components/UI/CustomSpinner/customSpinner";

type Props = {
  children: React.ReactNode;
  onClick?: () => Promise<unknown> | void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "outlined";
  disabled?: boolean;
  className?: string;
};

export function Button(props: Props) {
  const {
    onClick,
    disabled = false,
    variant = "primary",
    children,
    type = "button",
    className,
  } = props;

  const [isLoading, setLoading] = useState(false);

  const onClickHandler = async () => {
    if (typeof onClick === "function") {
      const callResult = onClick();
      if (callResult && typeof callResult.then === "function") {
        setLoading(true);
        await callResult;
        setLoading(false);
      }
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClickHandler}
      className={classnames(
        "custom-btn",
        {
          ["custom-btn-outlined"]: variant === "outlined",
        },
        className,
      )}
    >
      {isLoading ? <CustomSpinner /> : children}
    </button>
  );
}
