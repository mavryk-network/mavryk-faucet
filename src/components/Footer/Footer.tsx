import { Github } from "react-bootstrap-icons";
import "./styled.css";
import TwitterIcon from "../../icons/glyphs/TwitterIcon";

function Footer() {
  return (
    <footer className="footer-wrapper">
      <a
        href="https://x.com/MavrykNetwork"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-link"
      >
        <TwitterIcon />
      </a>
      <a
        href="https://github.com/mavryk-network"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-link"
      >
        <Github size={15} />
      </a>
    </footer>
  );
}

export default Footer;
