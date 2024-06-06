import { validateKeyHash } from "@mavrykdynamics/taquito-utils"
import { ChangeEvent, useState } from "react"
import { Form } from "react-bootstrap"
import { autoSelectInputText } from "../../lib/Utils"
import FaucetRequestButton from "./FaucetRequestButton"

import { Network, StatusContext } from "../../lib/Types"

export default function FaucetToInputRequest({
  network,
  status,
  amount,
  setAmount,
  inputToAddr,
  setInputToAddr
}: {
  network: Network
  status: StatusContext
  amount: number
  setAmount: (amount: number) => void
  inputToAddr: any
  setInputToAddr: any

}) {
  const [inputClass, setInputClass] = useState<string>("")

  const inputId: string = network.name + "-to"
  const disableButton = status.isLoading || inputClass !== "is-valid"

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value

    if (value.length === 0 || validateKeyHash(value) === 3) {
      setInputToAddr(value)

      if (value.length > 0) setInputClass("is-valid")
      else setInputClass("")
    } else {
      setInputClass("is-invalid")
    }
  }

  return (
    <>
      <Form.Group className="faucet-address-to">
        <Form.Control
          type="text"
          placeholder="mv1..."
          id={inputId}
          className={inputClass}
          disabled={status.isLoading}
          onChange={handleInput}
          onClick={autoSelectInputText}
        />
        <Form.Control.Feedback type="invalid" className="position-absolute">
          Invalid address
        </Form.Control.Feedback>
      </Form.Group>

      <FaucetRequestButton
        address={inputToAddr}
        disabled={disableButton}
        network={network}
        status={status}
        amount={amount}
        setAmount={setAmount}
      />
    </>
  )
}
