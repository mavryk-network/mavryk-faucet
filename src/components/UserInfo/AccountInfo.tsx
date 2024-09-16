import "./styled.css";
import { toBalance } from "../../lib/Utils";
import { useUserContext } from "../../providers/UserProvider/user.provider";
import {NavDropdown} from "react-bootstrap";

export function AccountInfo() {
  const { user } = useUserContext();

  if (!user.address) return null;
  return (

      <div className="account-info-wrapper">
        <div className="account-info-address">{user.address}</div>
        <div className="account-info-balance">
          {toBalance(user.balance)} MVRK
        </div>
      </div>
  );
}
