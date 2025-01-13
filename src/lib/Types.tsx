import { Dispatch, SetStateAction } from "react";
import { TezosToolkit } from "@mavrykdynamics/taquito";
import { BeaconWallet } from "@mavrykdynamics/taquito-beacon-wallet";
import { NetworkType } from "@mavrykdynamics/beacon-types";

type ApplicationConfig = {
  name: string;
  googleCaptchaSiteKey: string;
  isBeaconWallet?: boolean;
  backendUrl: string;
  githubRepo: string;
  apiMavrykUrl: string;
  disableChallenges?: boolean;
  minMav: number;
  maxMav: number;
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
};

// Must match Config.tsx "network" item
export type Network = {
  name: string;
  rpcUrl: string;
  faucetAddress: string;
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
  wallet: BeaconWallet;
  setWallet: Dispatch<SetStateAction<any>>;
  Tezos: TezosToolkit;
  setTezos: Dispatch<SetStateAction<any>>;
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
