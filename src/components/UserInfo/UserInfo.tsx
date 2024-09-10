import { UserContext } from "../../lib/Types";
import { shortenAddress } from "../../utils/formaters";
import './styled.css';

function UserInfo({ user }: { user: UserContext }) {
  return (
    <div className="user-info-wrapper">
      <img alt="account" src='/assets/account.png' className="user-info-image" />
      <div className="user-info-content">
        <span className="user-info-account-name">Account 1</span>
        <span className="user-info-address">
          {shortenAddress(user.userAddress) || "Not connected"}
        </span>
      </div>
    </div>
  );
}

export default UserInfo;
