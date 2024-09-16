import React from "react";
import Wallet from "../Wallet/Wallet";
import "./styled.css";

export function MyAddress() {
  return (
    <div className="my-address-wrapper">
      <span className="my-address-wrapper-text">Your Address to Fund</span>
      <Wallet type="accountInfo" />
    </div>
  );
}
