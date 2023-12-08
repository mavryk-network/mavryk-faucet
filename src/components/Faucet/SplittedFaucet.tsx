import { useState, useEffect } from "react"
import { TezosToolkit } from "@mavrykdynamics/taquito"
import { Alert, Card, Col, Row, Button, ProgressBar } from "react-bootstrap"
import Parser from "html-react-parser"
import FaucetToWalletRequest from "./FaucetToWalletRequest"
import FaucetToInputRequest from "./FaucetToInputRequest"
import Config from "../../Config"

import { Network, UserContext, StatusContext } from "../../lib/Types"

const { minMav, maxMav } = Config.application
export default function SplittedFaucet({
  network,
  user,
  Tezos,
}: {
  network: Network
  user: UserContext
  Tezos: TezosToolkit
}) {
  const faucetAddress = network.faucetAddress
  const [faucetBalance, setFaucetBalance] = useState<number>(0)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<string>("")
  const [statusType, setStatusType] = useState<string>("")
  const [showPowProgress, setShowPowProgress] = useState(false)
  const [powWorker, setPowWorker] = useState<Worker | null>(null)
  const [showInfo, setShowInfo] = useState(
    localStorage.getItem("showInfo") !== "false"
  )
  const [amount, setAmount] = useState<number>(minMav)
  const [inputToAddr, setInputToAddr] = useState<string>("")

  const unsetStatus = () => (setStatus(""), setStatusType(""))

  const progress = showPowProgress ? Math.ceil(Number(status)) : 0
  const statusContext: StatusContext = {
    isLoading,
    setLoading,
    status,
    setStatus,
    statusType,
    setStatusType,
    powWorker,
    setPowWorker,
  }

  const readBalances = async (): Promise<void> => {
    try {
      const faucetBalance = await Tezos.tz.getBalance(faucetAddress)
      setFaucetBalance(faucetBalance.toNumber())

      const userBalance = await Tezos.tz.getBalance(user.userAddress)
      user.setUserBalance(userBalance.toNumber())
    } catch (error) {
      //console.log(error);
    }
  }

  useEffect(() => {
    readBalances()
  }, [isLoading])

  useEffect(() => {
    setShowPowProgress(!!(statusType && statusType === "solving"))
    if (!showInfo) setShowInfo(false)
  }, [statusType, showInfo])

  return (
    <Card className="mt-3">
      <Card.Header>
        <Card.Title>{network.name} Faucet</Card.Title>
      </Card.Header>

      <Card.Body>
        <Row className="gy-2">
          <Col md={6} className="faucet-part">
            <Card.Text className="faucet-part-title">
              Fund your web wallet
            </Card.Text>
            <FaucetToWalletRequest
              network={network}
              user={user}
              status={statusContext}
              amount={amount}
              setAmount={setAmount}
              inputToAddr={inputToAddr}
              setInputToAddr={setInputToAddr}
            />
          </Col>
          <Col md={6} className="faucet-part">
            <Card.Text className="faucet-part-title">
              Fund any address
            </Card.Text>
            <FaucetToInputRequest
              network={network}
              status={statusContext}
              amount={amount}
              setAmount={setAmount}
              inputToAddr={inputToAddr}
              setInputToAddr={setInputToAddr}
            />
          </Col>
        </Row>

        {showPowProgress && (
          <Card className="mt-4">
            <Card.Body>
              <Card.Subtitle>Solving Challenges...</Card.Subtitle>
              <div className="d-flex align-items-center">
                <ProgressBar
                  animated
                  className="flex-fill"
                  now={Math.max(progress, 10)}
                  label={`${progress}%`}
                />

                {isLoading && (
                  <Button
                    className="ms-3"
                    variant="secondary"
                    onClick={() => {
                      if (powWorker) {
                        powWorker.terminate()
                        setPowWorker(null)
                        setLoading(false)
                        unsetStatus()
                        setShowPowProgress(false)
                      }
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        )}

        {!showPowProgress && status && statusType && (
          <Alert dismissible variant={statusType} onClose={unsetStatus}>
            <div className="d-inline-block">{Parser(status)}</div>
          </Alert>
        )}

        {!Config.application.disableChallenges && (
          <>
            <hr />
            <div className="d-flex justify-content-end">
              {!showInfo && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowInfo(true)
                    localStorage.setItem("showInfo", "true")
                  }}
                >
                  Show Info
                </Button>
              )}
            </div>

            <Alert show={showInfo} variant="secondary" className="mt-3">
              <p>
                Tired of captchas? Need to fund a lot of addresses?
              </p>
              <p>
                💡 Try the <a href="https://forum.tezosagora.org/t/programmatic-faucet/5804" target="_blank"><b>get-mav</b></a> command!
              </p>
              <p>
                <code>npx @mavrykdynamics/get-mav {inputToAddr || '<your-address>'} --amount {amount} --network {network.name.toLowerCase()}</code>
              </p>
              <p>
                You can also request tokens with the <a href="https://www.npmjs.com/package/@mavrykdynamics/get-mav" target="_blank">get-mav NodeJS library</a> or directly through the <a href="https://github.com/oxheadalpha/tezos-faucet-backend#api-endpoints" target="_blank">API</a>.
              </p>
              <p>
                Note: to prevent abuse, tokens are granted more slowly when using this method.
              </p>

              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setShowInfo(false)
                    localStorage.setItem("showInfo", "false")
                  }}
                >
                  Hide
                </Button>
              </div>
            </Alert>
          </>
        )}
      </Card.Body>
    </Card>
  )
}
