import { shortenAddress } from "~/utils/formaters";
import "./styled.css";
import UserIcon from "../UI/UserIcon/UserIcon";
import { useUserContext } from "~/providers/UserProvider/user.provider";
import { NavDropdown } from "react-bootstrap";

function UserInfo() {
  const { user, changeUser, signOut } = useUserContext();

  if (!user.address) return null;

  return (
    <div className="user-info-wrapper">
      <NavDropdown
        title={
          <div className="user-info-wrapper">
            <UserIcon type="bottts" size={32} hash={user.address} />
            {/*<img alt="account" src='/assets/account.png' className="user-info-image" />*/}
            <div className="user-info-content">
              <span className="user-info-account-name">Account 1</span>
              <span className="user-info-address">
                {shortenAddress(user.address) || "Not connected"}
              </span>
            </div>
          </div>
        }
      >
        <NavDropdown.Item onClick={changeUser}>Change Account</NavDropdown.Item>
        <NavDropdown.Item onClick={signOut}>Disconnect</NavDropdown.Item>
      </NavDropdown>
    </div>
  );
}

export default UserInfo;
