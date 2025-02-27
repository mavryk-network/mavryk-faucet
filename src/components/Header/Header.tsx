import "./styled.css";
import Wallet from "../Wallet/Wallet";

function Header(props: { isMaintenance: boolean }) {
  return (
    <div className="header-wrapper">
      <a href="https://mavrykdynamics.com" target="_blank">
        <img
          src="/faucet-logo.png"
          className="d-inline-block align-top header-logo-image"
          alt="Mavryk Dynamics Logo"
        />
      </a>
      {props.isMaintenance ? null : <Wallet />}
    </div>
  );
}

export default Header;
