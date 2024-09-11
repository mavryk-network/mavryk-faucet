import "./styled.css";
import { UserContext } from "../../lib/Types";
import { toBalance } from "../../lib/Utils";

export function AccountInfo({ user }: { user: UserContext }) {
  return (
    <div className="account-info-wrapper">
      <div className="account-info-address">{user.userAddress}</div>
      <div className="account-info-balance">
        {toBalance(user.userBalance)} MVRK
      </div>
    </div>
  );
}
