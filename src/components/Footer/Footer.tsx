import { Github, Twitter } from "react-bootstrap-icons"
import {useMemo} from "react";
import './styled.css';
import TwitterIcon from "../../icons/glyphs/TwitterIcon";

function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="footer-wrapper">
      <span className="footer-text">© {currentYear} Mavryk Dynamics</span>
     <div className="footer-links-list">
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
     </div>
    </footer>
  )
}

export default Footer
