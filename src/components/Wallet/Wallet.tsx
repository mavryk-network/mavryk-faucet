import { BeaconWallet } from "@mavrykdynamics/taquito-beacon-wallet";
import { useEffect } from "react";
import { Button } from "../UI/Button/button";
import UserInfo from "../UserInfo/UserInfo";
import { Network, TestnetContext, UserContext } from "../../lib/Types";
import { NetworkType } from "@mavrykdynamics/beacon-types";
import "./wallet.css";
import { AccountInfo } from "../UserInfo/AccountInfo";

type Props = {
  user: UserContext;
  testnetContext: TestnetContext;
  network: Network;
  type?: "accountInfo" | "userInfo";
};

function Wallet(props: Props) {
  const { user, testnetContext, network, type = "accountInfo" } = props;

  const setup = async (userAddress: string): Promise<void> => {
    user.setUserAddress(userAddress);

    const balance = await testnetContext.Tezos.tz.getBalance(userAddress);
    user.setUserBalance(balance.toNumber());
  };

  const connectWallet = async (): Promise<void> => {
    if (!network.networkType) {
      console.error("No network defined.");
      return;
    }

    try {
      await testnetContext.wallet.requestPermissions({
        network: {
          type: network.networkType,
          rpcUrl: network.rpcUrl,
        },
      });
      // gets user's address
      const userAddress = await testnetContext.wallet.getPKH();
      await setup(userAddress);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      // creates a wallet instance
      const wallet = new BeaconWallet({
        name: "Maven",
        preferredNetwork: "atlasnet" as NetworkType,
        disableDefaultEvents: false,
      });
      testnetContext.Tezos.setWalletProvider(wallet);
      testnetContext.setWallet(wallet);
      // checks if wallet was connected before
      const activeAccount = await wallet.client.getActiveAccount();
      if (activeAccount) {
        const userAddress = await wallet.getPKH();
        await setup(userAddress);
      }
    })();
  }, []);

  if (type === "userInfo")
    return user.userAddress ? (
      <UserInfo user={user} displayBalance={false} />
    ) : (
      <div className="wallet-btn-wrapper">
        <Button onClick={connectWallet}>Connect wallet</Button>
      </div>
    );

  return user.userAddress ? (
    <AccountInfo user={user} displayBalance={false} />
  ) : (
    <div className="wallet-btn-wrapper">
      <Button variant="outlined" onClick={connectWallet}>
        Connect wallet
      </Button>
    </div>
  );
}

export default Wallet;
