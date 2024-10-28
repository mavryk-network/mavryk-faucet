import classnames from "classnames";
import React, { useState } from "react";
import "./tooltip.css";

type Props = {
  messageClassName?: string;
  className?: string;
  children: React.ReactNode;
  element?: React.ReactNode;
};

export default function Tooltip({
  children,
  className,
  messageClassName,
  element,
}: Props) {
  const [isHover, setIsHover] = useState<boolean>(false);
  return (
    <div
      className={classnames("tooltipWrapper", className)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {element}
      {isHover && (
        <div className={classnames("tooltipMessage", messageClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}
