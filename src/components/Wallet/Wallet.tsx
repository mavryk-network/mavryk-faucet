import { Button } from "../UI/Button/button";
import UserInfo from "../UserInfo/UserInfo";
import "./wallet.css";
import { useUserContext } from "~/providers/UserProvider/user.provider";

function Wallet() {
  const { connect, user } = useUserContext();

  return user.address ? (
    <UserInfo />
  ) : (
    <div className="wallet-btn-wrapper">
      <Button
        variant="outlined"
        onClick={() => {
          connect();
        }}
      >
        Connect Wallet
      </Button>
    </div>
  );
}

export default Wallet;
