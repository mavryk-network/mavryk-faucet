import "./styled.css";
import Wallet from "../Wallet/Wallet";

function Header() {
  return (
    <div className="header-wrapper">
      <a href="https://mavrykdynamics.com" target="_blank">
        <img
          src="/faucet-logo.png"
          className="d-inline-block align-top header-logo-image"
          alt="Mavryk Dynamics Logo"
        />
      </a>
      <Wallet />
    </div>
  );
}

export default Header;
