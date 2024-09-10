import React from "react";
import Wallet from "../Wallet/Wallet";
import "./styled.css";
import { Network, TestnetContext, UserContext } from "../../lib/Types";

type Props = {
  user: UserContext;
  testnet: TestnetContext;
  network: Network;
};

export function MyAddress(props: Props) {
  const { user, network, testnet } = props;

  return (
    <div className="my-address-wrapper">
      <span className="my-address-wrapper-text">Your Address to Fund</span>
      <Wallet
        user={user}
        testnetContext={testnet}
        network={network}
        type="accountInfo"
      />
    </div>
  );
}
