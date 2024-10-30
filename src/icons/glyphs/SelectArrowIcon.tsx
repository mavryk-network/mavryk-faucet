import * as React from "react";
import type { Icon } from "../icon.types";

function SelectArrowIcon(props: Icon) {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.6663 7.5L7.99967 12.1667L3.33301 7.5"
        stroke="#F4F4F4"
        strokeWidth="1.3125"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SelectArrowIcon;
