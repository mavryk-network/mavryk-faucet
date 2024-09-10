import './styled.css';
import SplittedWallet from "../Wallet/SplittedWallet";
import {Network, TestnetContext, UserContext} from "../../lib/Types";

type Props = {
  user: UserContext
  testnet: TestnetContext
  network: Network
};

function Header(props: Props) {
  const {
    user,
    testnet,
    network,
  } = props

  return (
      <div className="header-wrapper">
        <a href="https://www.mavrykdynamics.com" target="_blank">
          <img
              src="/faucet-logo.png"
              className="d-inline-block align-top"
              alt="Mavryk Dynamics Logo"
          />
        </a>
        <SplittedWallet
            user={user}
            network={network}
            testnetContext={testnet}
        />
      </div>
  )
}

export default Header
