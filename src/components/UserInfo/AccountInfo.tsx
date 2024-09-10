import "./styled.css";

import { UserContext } from "../../lib/Types";
import { formatNumber } from "../../utils/formaters";

export function AccountInfo({ user }: { user: UserContext }) {
  return (
    <div className="account-info-wrapper">
      <div className="account-info-address">{user.userAddress}</div>
      <div className="account-info-balance">
        {formatNumber({ number: user.userBalance })} MVRK
      </div>
    </div>
  );
}
