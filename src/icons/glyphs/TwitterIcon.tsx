import * as React from "react";
import type { Icon } from "../icon.types";

function TwitterIcon(props: Icon) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4.6665 5.33398H6.33317L16.3332 18.6673H14.6665L4.6665 5.33398ZM7.6665 5.33398H9.33317L19.3332 18.6673H17.6665L7.6665 5.33398ZM5.99984 5.33398H9.33317V6.66732H5.99984V5.33398ZM14.6665 17.334H17.9998V18.6673H14.6665V17.334ZM16.3332 5.33398H18.6665L7.33317 18.6673H4.99984L16.3332 5.33398Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default TwitterIcon;
