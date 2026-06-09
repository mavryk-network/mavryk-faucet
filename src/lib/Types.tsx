import { Dispatch, SetStateAction } from "react";
import { MavrykToolkit } from "@mavrykdynamics/webmavryk";
import { MavletWallet } from "@mavrykdynamics/webmavryk-mavlet-wallet";
import { NetworkType } from "@mavrykdynamics/mavlet-types";

type ApplicationConfig = {
  name: string;
  googleCaptchaSiteKey: string;
  isMavletWallet?: boolean;
  backendUrl: string;
  githubRepo: string;
  apiMavrykUrl: string;
  maintenance: boolean;
  disableChallenges?: boolean;
};

export type ConfigType = {
  application: ApplicationConfig;
  network: Network;
};

export enum TokenType {
  mvrk = "mvrk",
  usdt = "usdt",
  mvn = "mvn",
}

export type Challenge = {
  challenge: string;
  difficulty: number;
  challengeCounter: number;
  challengesNeeded: number;
};

export type ChallengeResponse = Partial<Challenge> & {
  status?: string;
  message?: string;
};

export type VerifyResponse = Partial<Challenge> & {
  status?: string;
  message?: string;
  txHash?: string;
  requestId?: string;
};

export type StatusResponse = {
  status: string;
  requestId: string;
  requestStatus: "pending" | "batched" | "confirmed" | "failed";
  txHash?: string;
  errorMessage?: string;
  position?: number;
};

// Must match Config.tsx "network" item
export type Network = {
  name: string;
  rpcUrl: string;
  viewer: string;
  networkType?: NetworkType;
};

export type UserContext = {
  userAddress: string;
  setUserAddress: Dispatch<SetStateAction<string>>;
  userBalance: number;
  setUserBalance: Dispatch<SetStateAction<number>>;
};

export type TestnetContext = {
  network: Network;
  wallet: MavletWallet;
  setWallet: Dispatch<SetStateAction<any>>;
  Mavryk: MavrykToolkit;
  setMavryk: Dispatch<SetStateAction<any>>;
};

export type StatusContext = {
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  status: string;
  setStatus: Dispatch<SetStateAction<string>>;
  statusType: string;
  setStatusType: Dispatch<SetStateAction<string>>;
  powWorker: Worker | null;
  setPowWorker: Dispatch<SetStateAction<Worker | null>>;
};
