import React from "react";
import "./styled.css";

export function Maintenance() {
  return (
    <div className="maintenance-main-wrapper">
      <div className="maintenance-title">
        The Site Is Currently Down For Maintenance
      </div>
      <div className="maintenance-text">
        The Faucet will be back up shortly, we apologize for any inconveniences
        caused.
        <br /> See you soon!
      </div>
    </div>
  );
}
