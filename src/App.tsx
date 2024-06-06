import { useEffect, useState } from "react"
import { Row, Col, Container } from "react-bootstrap"
import { TezosToolkit } from "@mavrykdynamics/taquito"
import "./App.css"
//import AppLogo from "../public/faucet-logo.svg";
import Header from "./components/Header"
import Footer from "./components/Footer"
import SplittedFaucet from "./components/Faucet/SplittedFaucet"
import SplittedWallet from "./components/Wallet/SplittedWallet"
import { Network, TestnetContext, UserContext } from "./lib/Types"
import Config from "./Config"

function App() {
  // Common user data
  const [userAddress, setUserAddress] = useState<string>("")
  const [userBalance, setUserBalance] = useState<number>(0)

  // network data
  const [network, setNetwork] = useState<Network>(Config.network)
  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit(network.rpcUrl)
  )
  const [wallet, setWallet] = useState<any>(null)

  const user: UserContext = {
    userAddress,
    setUserAddress,
    userBalance,
    setUserBalance,
  }

  let testnet: TestnetContext = {
    network,
    wallet,
    setWallet,
    Tezos,
    setTezos,
  }

  useEffect(() => {
    console.log(`Loading ${Config.network.name}`)
  }, [])

  return (
    <>
      <Header />

      <Container>
        <Row className="d-flex gy-3 align-items-center">
          <Col sm={5} className="d-flex justify-content-center">
            <img src="faucet-logo.svg" alt="Faucet logo" />
          </Col>
          <Col sm={7}>
            <SplittedWallet
              user={user}
              network={network}
              testnetContext={testnet}
            />
          </Col>
        </Row>

        <SplittedFaucet network={network} user={user} Tezos={Tezos} />
      </Container>

      <Footer />
    </>
  )
}

export default App
