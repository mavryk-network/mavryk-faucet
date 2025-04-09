import "./styled.css";
import Wallet from "../Wallet/Wallet";

function Header(props: { isMaintenance: boolean }) {
  return (
    <header className="header-wrapper">
      <a
        aria-label="Mavryk Dynamics Logo"
        href="https://mavrykdynamics.com"
        target="_blank"
      >
        <picture className="header-logo">
          <source srcSet="/faucet-logo.png" media="(min-width: 768px)" />
          <img
            src="/faucet-short-logo.png"
            width={172}
            height={36}
            className="d-inline-block align-top header-logo-image"
            alt="Mavryk Dynamics Logo"
          />
        </picture>
      </a>
      {props.isMaintenance ? null : <Wallet />}
    </header>
  );
}

export default Header;
