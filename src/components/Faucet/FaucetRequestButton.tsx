import axios from "axios";
import { Dispatch, RefObject, SetStateAction, useRef } from "react";
import { Button } from "../UI/Button/button";
import ReCAPTCHA from "react-google-recaptcha";

import PowWorker from "../../powWorker?worker&inline";
import Config from "../../Config";
import {
  Challenge,
  ChallengeResponse,
  Network,
  StatusContext,
  StatusResponse,
  TokenType,
  VerifyResponse,
} from "~/lib/Types";
import { FormState } from "./Faucet";
import { useUserContext } from "~/providers/UserProvider/user.provider";
import { useToasterContext } from "~/providers/ToasterProvider/toaster.provider";
import { tokensLabels } from "~/components/Faucet/Faucet.const";
import { RequestState } from "./RequestStatus";

export const api = axios.create({
  baseURL: Config.application.backendUrl,
  timeout: 50_000,
  timeoutErrorMessage: "Connection timeout exceeded. Please try again.",
});

export default function FaucetRequestButton({
  disabled,
  network,
  status,
  formState,
  maxTokenAmount,
  setRequestState,
}: {
  formState: FormState;
  disabled: boolean;
  network: Network;
  maxTokenAmount: number;
  status: StatusContext;
  setRequestState: Dispatch<SetStateAction<RequestState>>;
}) {
  const { readBalances } = useUserContext();
  const recaptchaRef: RefObject<ReCAPTCHA> = useRef(null);
  const { bug, success } = useToasterContext();

  const amount = Number(maxTokenAmount);

  const startLoading = () => {
    status.setLoading(true);
    status.setStatus("");
    status.setStatusType("");
    setRequestState({ phase: "solving", progress: 0 });
  };

  const stopLoadingSuccess = async (txHash?: string) => {
    status.setStatusType("success");
    status.setLoading(false);
    setRequestState((prev) => ({
      ...prev,
      phase: "confirmed",
      txHash,
    }));
    success("Tokens sent successfully!");
    await readBalances();
  };

  const stopLoadingError = (message: string) => {
    status.setStatusType("danger");
    status.setLoading(false);
    setRequestState((prev) => ({
      ...prev,
      phase: "failed",
      errorMessage: message,
    }));
    bug(message || "Something went wrong. Please try again");
  };

  const validateChallenge = (data: Partial<Challenge>): data is Challenge =>
    !!(
      data.challenge &&
      data.difficulty &&
      data.challengeCounter &&
      data.challengesNeeded
    );

  const getProgressNum = (counter: number, needed: number) =>
    Math.min(99, Math.floor((counter / needed) * 100));

  const execCaptcha = async () => {
    const captchaToken: any = await recaptchaRef.current?.executeAsync();
    recaptchaRef.current?.reset();
    if (!captchaToken) {
      bug("Captcha error, please try again in a few minutes.");
      stopLoadingError("Captcha error, please try again in a few minutes.");
      return;
    }
    return captchaToken;
  };

  const solvePow = async (
    { challenge, difficulty, challengeCounter, challengesNeeded }: Challenge,
    powWorker: Worker,
  ) => {
    const progress = getProgressNum(challengeCounter - 1, challengesNeeded);
    status.setStatusType("solving");
    status.setStatus(String(progress));
    setRequestState({ phase: "solving", progress });

    const powSolution: Promise<{ solution: string; nonce: number }> =
      new Promise((resolve, reject) => {
        powWorker.onerror = (e) => reject(e);
        powWorker.onmessage = ({ data }) =>
          data.message ? reject(data) : resolve(data);
      });

    powWorker.postMessage({ challenge, difficulty });

    await powSolution;

    const newProgress = getProgressNum(challengeCounter, challengesNeeded);
    status.setStatus(String(newProgress));
    setRequestState({ phase: "solving", progress: newProgress });

    return powSolution;
  };

  const getMav = async () => {
    try {
      startLoading();
      if (Config.application.disableChallenges) {
        setRequestState({ phase: "submitting" });
        return verifySolution({ solution: "", nonce: 0 });
      }

      let challengeRes = await getChallenge();

      const powWorker = new PowWorker();
      status.setPowWorker(powWorker);

      try {
        while (validateChallenge(challengeRes)) {
          const powSolution = await solvePow(challengeRes, powWorker);

          setRequestState({ phase: "submitting" });
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

      const input = {
        address: formState.address,
        amount,
        token: formState.selectedToken,
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
      address: formState.address,
      token: formState.selectedToken,
      amount,
      nonce,
      solution,
    };

    try {
      const { data }: { data: VerifyResponse } = await api.post(
        "/verify",
        input,
      );

      if (validateChallenge(data)) {
        return data;
      } else if (data.requestId) {
        await pollStatus(data.requestId);
      } else if (data.txHash) {
        await stopLoadingSuccess(data.txHash);
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

  const pollStatus = async (requestId: string): Promise<void> => {
    const maxPollTime = 5 * 60 * 1000;
    const pollInterval = 3000;
    const startTime = Date.now();

    setRequestState({ phase: "pending", requestId });

    while (Date.now() - startTime < maxPollTime) {
      await new Promise((res) => setTimeout(res, pollInterval));

      try {
        const { data }: { data: StatusResponse } = await api.get(
          `/status/${requestId}`,
        );

        if (data.requestStatus === "confirmed" && data.txHash) {
          await stopLoadingSuccess(data.txHash);
          return;
        }

        if (data.requestStatus === "failed") {
          stopLoadingError(
            data.errorMessage || "Transaction failed. Please try again.",
          );
          return;
        }

        if (data.requestStatus === "batched") {
          setRequestState({
            phase: "batched",
            requestId,
          });
        } else {
          setRequestState({
            phase: "pending",
            requestId,
            position: data.position,
          });
        }
      } catch (err: any) {
        console.error("Poll error:", err);
      }
    }

    stopLoadingError(
      `Request is still processing (ID: ${requestId}). Please check back later.`,
    );
  };

  return (
    <div className="faucet-btn-wrapper">
      {!Config.application.disableChallenges && (
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          badge="bottomleft"
          sitekey={Config.application.googleCaptchaSiteKey}
        />
      )}

      <Button disabled={disabled} onClick={getMav}>
        <span className="requestBtnText">
          Request{" "}
          {formState.selectedToken
            ? tokensLabels[formState.selectedToken as TokenType]
            : "Token"}
        </span>
      </Button>
    </div>
  );
}
