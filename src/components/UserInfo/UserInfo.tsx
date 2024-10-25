import { shortenAddress } from "~/utils/formaters";
import "./styled.css";
import UserIcon from "../UI/UserIcon/UserIcon";
import { useUserContext } from "~/providers/UserProvider/user.provider";
import { NavDropdown } from "react-bootstrap";
import SelectArrowIcon from "~/icons/glyphs/SelectArrowIcon";
import { useState } from "react";

function UserInfo() {
  const { user, changeUser, signOut } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);

  if (!user.address) return null;

  const handleToggle = (isOpen) => {
    setIsOpen(isOpen);
  };

  return (
    <div className="user-info-wrapper">
      <NavDropdown
        onToggle={handleToggle}
        title={
          <div className="user-info">
            <UserIcon type="bottts" size={32} hash={user.address} />
            <div className="user-info-content">
              <span>{shortenAddress(user.address) || "Not connected"}</span>
              <SelectArrowIcon className={isOpen ? "user-info-rotate-icon" : "user-info-icon"} />
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
