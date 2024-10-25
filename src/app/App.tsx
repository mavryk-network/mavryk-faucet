import { useState } from "react";
import "./App.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Faucet from "../components/Faucet/Faucet";
import { Network } from "~/lib/Types";
import Config from "../Config";

function App() {
  const [network, setNetwork] = useState<Network>(Config.network);

  return (
    <div className="main-wrapper">
      <Header />

      <Faucet network={network} />

      <Footer />

      <div className="orangeShadow" />
      <div className="blueShadow" />
    </div>
  );
}

export default App;
