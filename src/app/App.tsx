import { useState } from "react";
import "./App.css";
import Header from "../components/Header/Header";
import Faucet from "../components/Faucet/Faucet";
import { Network } from "~/lib/Types";
import Config from "../Config";
import { ToasterMessages } from "~/providers/ToasterProvider/components/ToasterMessages";
import { Maintenance } from "~/components/Maintenance/Maintenance";
import Footer from "~/components/Footer/Footer";

const isMaintenance = Config.application.maintenance;

function App() {
  const [network, setNetwork] = useState<Network>(Config.network);

  return (
    <div className="main-wrapper">
      <ToasterMessages />

      <Header isMaintenance={isMaintenance} />

      {isMaintenance ? <Maintenance /> : <Faucet network={network} />}

      <Footer />

      <div className="orangeShadow">
        <img src="/assets/bg-orange.png" />
      </div>
      <div className="orangeShadow">
        <img src="/assets/bg-blue.png" />
      </div>
    </div>
  );
}

export default App;
