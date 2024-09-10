import { useEffect, useState } from "react";
import { TezosToolkit } from "@mavrykdynamics/taquito";
import "./App.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Faucet from "../components/Faucet/Faucet";
import { Network, TestnetContext, UserContext } from "../lib/Types";
import Config from "../Config";

function App() {
  // Common user data
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);

  // network data
  const [network, setNetwork] = useState<Network>(Config.network);
  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit(network.rpcUrl),
  );
  const [wallet, setWallet] = useState<any>(null);

  const user: UserContext = {
    userAddress,
    setUserAddress,
    userBalance,
    setUserBalance,
  };

  let testnet: TestnetContext = {
    network,
    wallet,
    setWallet,
    Tezos,
    setTezos,
  };

  useEffect(() => {
    console.log(`Loading ${Config.network.name}`);
  }, []);

  return (
    <div className="main-wrapper">
      <Header user={user} network={network} testnet={testnet} />

      <Faucet network={network} user={user} Tezos={Tezos} />

      <Footer />
    </div>
  );
}

export default App;
