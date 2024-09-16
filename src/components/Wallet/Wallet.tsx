import { Button } from "../UI/Button/button";
import UserInfo from "../UserInfo/UserInfo";
import "./wallet.css";
import { AccountInfo } from "../UserInfo/AccountInfo";
import { useUserContext } from "../../providers/UserProvider/user.provider";

type Props = {
  type?: "accountInfo" | "userInfo";
  className?: string;
};

function Wallet(props: Props) {
  const { type = "accountInfo", className } = props;

  const { connect, user } = useUserContext();

  if (type === "userInfo")
    return user.address ? (
      <UserInfo />
    ) : (
      <div className="wallet-btn-wrapper">
        <Button
          onClick={() => {
            connect();
          }}
          className={className}
        >
          Connect Wallet
        </Button>
      </div>
    );

  return user.address ? (
    <AccountInfo />
  ) : (
    <div className="wallet-btn-wrapper">
      <Button
        variant="outlined"
        onClick={() => {
          connect();
        }}
        className={className}
      >
        Connect Wallet
      </Button>
    </div>
  );
}

export default Wallet;
