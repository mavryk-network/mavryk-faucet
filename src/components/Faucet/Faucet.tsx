import {useState, useEffect, useMemo} from "react"
import { TezosToolkit } from "@mavrykdynamics/taquito"
import { Alert, Card, Col, Row, ProgressBar } from "react-bootstrap"
import './styled.css';
import FaucetToWalletRequest from "./FaucetToWalletRequest"
import FaucetToInputRequest from "./FaucetToInputRequest"
import Config from "../../Config"

import {Network, UserContext, StatusContext, TransactionType} from "../../lib/Types"
import {Input} from "../UI/Input/Input";
import {AddressField} from "./AddressField";
import {AmountField} from "./AmountField";
import {TransactionTypeSelect} from "./TransactionTypeSelect";
import {TokenSelect} from "./TokenSelect";
import {Button} from "../UI/Button/button";
import {tokensLabels} from "./Faucet.const";
import FaucetRequestButton from "./FaucetRequestButton";

const { minMav, maxMav } = Config.application

export default function Faucet({
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
  const [amount, setAmount] = useState<number>(minMav)
  const [inputToAddr, setInputToAddr] = useState<string>("")
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

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

  const isDisabledButton = useMemo(() => {
    if(transactionType === TransactionType.address) return !inputToAddr || statusContext.isLoading || !amount;
    if(transactionType === TransactionType.wallet) return !user.userAddress || statusContext.isLoading || !amount
      return true;
  },[transactionType, inputToAddr, statusContext, amount, user])

  const requestAddress = useMemo(() => transactionType === TransactionType.address ? inputToAddr : user.userAddress,[transactionType, user, inputToAddr])

  useEffect(() => {
    readBalances()
  }, [isLoading])

  useEffect(() => {
    setShowPowProgress(!!(statusType && statusType === "solving"))
  }, [statusType])

  return (
    <div className="faucet-main-wrapper">
      <div className="faucet-info-block">
      <h1 className="faucet-main-title">
        {network.name} Faucet
      </h1>
      <div className="faucet-info-text">Please note, the tokens from the Faucet are testnet tokens only.</div>
      </div>

      <div className="faucet-container">

        <TransactionTypeSelect
            transactionType={transactionType}
            setTransactionType={setTransactionType}
        />

        {transactionType === TransactionType.address && <AddressField
              status={statusContext}
              inputToAddr={inputToAddr}
              setInputToAddr={setInputToAddr}
            />}

        <TokenSelect selectedToken={selectedToken} setSelectedToken={setSelectedToken} />

        <AmountField
            amount={amount}
            selectedToken={selectedToken}
            setAmount={setAmount}
            status={statusContext} />

        <FaucetRequestButton
            address={requestAddress}
            disabled={isDisabledButton}
            network={network}
            status={statusContext}
            amount={amount}
            selectedToken={selectedToken}
        />

        {/*{showPowProgress && (*/}
        {/*  <Card className="mt-4">*/}
        {/*    <Card.Body>*/}
        {/*      <Card.Subtitle>Solving Challenges...</Card.Subtitle>*/}
        {/*      <div className="d-flex align-items-center">*/}
        {/*        <ProgressBar*/}
        {/*          animated*/}
        {/*          className="flex-fill"*/}
        {/*          now={Math.max(progress, 10)}*/}
        {/*          label={`${progress}%`}*/}
        {/*        />*/}

        {/*        {isLoading && (*/}
        {/*          <Button*/}
        {/*            className="ms-3"*/}
        {/*            variant="secondary"*/}
        {/*            onClick={() => {*/}
        {/*              if (powWorker) {*/}
        {/*                powWorker.terminate()*/}
        {/*                setPowWorker(null)*/}
        {/*                setLoading(false)*/}
        {/*                unsetStatus()*/}
        {/*                setShowPowProgress(false)*/}
        {/*              }*/}
        {/*            }}*/}
        {/*          >*/}
        {/*            Cancel*/}
        {/*          </Button>*/}
        {/*        )}*/}
        {/*      </div>*/}
        {/*    </Card.Body>*/}
        {/*  </Card>*/}
        {/*)}*/}
      </div>
    </div>
  )
}
