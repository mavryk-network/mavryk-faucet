import axios from "axios";
import { RefObject, useRef, useState } from "react";
import { Button } from "../UI/Button/button";
import ReCAPTCHA from "react-google-recaptcha";

import PowWorker from "../../powWorker?worker&inline";
import Config from "../../Config";
import {
  Challenge,
  ChallengeResponse,
  Network,
  StatusContext,
  TokenType,
  TransactionType,
  VerifyResponse,
} from "~/lib/Types";
import { tokensLabels } from "./Faucet.const";
import { InfoModal } from "../UI/InfoModal/infoModal";
import { FormState } from "./Faucet";
import {useUserContext} from "~/providers/UserProvider/user.provider";

export const api = axios.create({
  baseURL: Config.application.backendUrl,
  timeout: 50_000,
  timeoutErrorMessage: "Connection timeout exceeded. Please try again.",
});

const { minMav, maxMav } = Config.application;

export default function FaucetRequestButton({
  disabled,
  network,
  status,
  formState,
  address,
  transactionType,
}: {
  formState: FormState;
  disabled: boolean;
  network: Network;
  status: StatusContext;
  address: string;
  transactionType: string | null;
}) {
  const { readBalances } = useUserContext();
  const recaptchaRef: RefObject<ReCAPTCHA> = useRef(null);

  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);

  const amount = Number(formState.tokenAmount);

  const startLoading = () => {
    status.setLoading(true);
    status.setStatus("");
    status.setStatusType("");
    setIsOpenSuccessModal(false);
    setIsOpenErrorModal(false);
  };

  const stopLoadingSuccess = async (message: string) => {
    status.setStatus(message);
    status.setStatusType("success");
    status.setLoading(false);
    setIsOpenSuccessModal(true);
    await readBalances();
  };

  const stopLoadingError = (message: string) => {
    status.setStatus(message);
    status.setStatusType("danger");
    status.setLoading(false);
    setIsOpenErrorModal(true);
  };

  const validateAmount = (amount: number) =>
    amount >= minMav && amount <= maxMav;

  const validateChallenge = (data: Partial<Challenge>): data is Challenge =>
    !!(
      data.challenge &&
      data.difficulty &&
      data.challengeCounter &&
      data.challengesNeeded
    );

  const getProgress = (challengeCounter: number, challengesNeeded: number) =>
    String(
      Math.min(99, Math.floor((challengeCounter / challengesNeeded) * 100)),
    );

  const execCaptcha = async () => {
    const captchaToken: any = await recaptchaRef.current?.executeAsync();
    recaptchaRef.current?.reset();
    if (!captchaToken) {
      stopLoadingError("Captcha error, please try again in a few minutes.");
      return;
    }
    return captchaToken;
  };

  const solvePow = async (
    { challenge, difficulty, challengeCounter, challengesNeeded }: Challenge,
    powWorker: Worker,
  ) => {
    status.setStatusType("solving");
    status.setStatus(getProgress(challengeCounter - 1, challengesNeeded));

    const powSolution: Promise<{ solution: string; nonce: number }> =
      new Promise((resolve, reject) => {
        powWorker.onerror = (e) => reject(e);
        powWorker.onmessage = ({ data }) =>
          data.message ? reject(data) : resolve(data);
      });

    powWorker.postMessage({ challenge, difficulty });

    await powSolution;

    status.setStatus(getProgress(challengeCounter, challengesNeeded));

    return powSolution;
  };

  const getMav = async () => {
    try {
      if (Config.application.disableChallenges) {
        startLoading();
        return verifySolution({ solution: "", nonce: 0 });
      }

      let challengeRes = await getChallenge();

      const powWorker = new PowWorker();
      status.setPowWorker(powWorker);

      try {
        while (validateChallenge(challengeRes)) {
          const powSolution = await solvePow(challengeRes, powWorker);

          const newChallengeRes = await verifySolution(powSolution);
          challengeRes = newChallengeRes;
        }
      } finally {
        powWorker.terminate();
        status.setPowWorker(null);
      }
    } catch (err: any) {
      stopLoadingError(err.message || "Error getting Mav");
    }
  };

  const getChallenge = async (): Promise<Partial<Challenge>> => {
    try {
      const captchaToken = await execCaptcha();

      startLoading();

      const input = {
        address,
        amount,
        captchaToken,
      };

      const { data }: { data: ChallengeResponse } = await api.post(
        "/challenge",
        input,
      );

      if (validateChallenge(data)) {
        return data;
      } else {
        stopLoadingError(data?.message || "Error getting challenge");
      }
    } catch (err: any) {
      stopLoadingError(
        err?.response?.data.message ||
          err?.message ||
          "Error getting challenge",
      );
    }
    return {};
  };

  const verifySolution = async ({
    solution,
    nonce,
  }: {
    solution: string;
    nonce: number;
  }): Promise<Partial<Challenge>> => {
    const input = {
      address,
      amount,
      nonce,
      solution,
    };

    try {
      const { data }: { data: VerifyResponse } = await api.post(
        "/verify",
        input,
      );

      // If there is another challenge
      if (validateChallenge(data)) {
        return data;
      } else if (data.txHash) {
        // All challenges were solved

        // Let the progress bar briefly show 100% before it goes away
        await new Promise((res) => setTimeout(res, 800));

        const viewerUrl = `${network.viewer}/${data.txHash}`;

        stopLoadingSuccess(
          `Your ṁ is on the way! <a target="_blank" href="${viewerUrl}" class="alert-link">Check it.</a>`,
        );
      } else {
        stopLoadingError("Error verifying solution");
      }
    } catch (err: any) {
      stopLoadingError(
        err?.response?.data.message || err?.message || err.message,
      );
    }
    return {};
  };

  return (
    <div className="faucet-btn-wrapper">
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        badge="bottomleft"
        sitekey={Config.application.googleCaptchaSiteKey}
      />

      <Button disabled={disabled || !validateAmount(amount)} onClick={getMav}>
        Request {tokensLabels[formState.selectedToken as TokenType] ?? "Token"}
      </Button>

      <InfoModal
        isOpen={isOpenSuccessModal}
        onClick={() => setIsOpenSuccessModal(false)}
        onClose={() => setIsOpenSuccessModal(false)}
        btnText="OK"
        message={`Fund ${transactionType === TransactionType.address ? "address" : "wallet"} request sent! Confirming...`}
      />
      <InfoModal
        isOpen={isOpenErrorModal}
        onClick={async () => {
          await getMav();
        }}
        onClose={() => setIsOpenErrorModal(false)}
        btnText="Try again"
        type="error"
        message="Something went wrong. Please try again"
      />
    </div>
  );
}
