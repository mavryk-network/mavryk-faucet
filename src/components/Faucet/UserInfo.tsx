import { Badge, Card } from "react-bootstrap"
import { Wallet2 } from "react-bootstrap-icons"
import { toBalance } from "../../lib/Utils"

import { UserContext } from "../../lib/Types"

function UserInfo({
  user,
  displayBalance,
}: {
  user: UserContext
  displayBalance: boolean
}) {
  return (
    <Card bg="light" text="dark" className="d-inline-block mw-100 mb-1">
      <Card.Body className="d-flex align-items-center p-1">
        <Wallet2 size={20} />
        <span className="text-truncate fw-bold ms-2 me-2">
          {user.userAddress || "Not connected"}
        </span>
        {displayBalance && (
          <Badge bg="secondary" className="balance-badge">
            {toBalance(user.userBalance)} ṁ
          </Badge>
        )}
      </Card.Body>
    </Card>
  )
}

export default UserInfo
