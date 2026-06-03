import { MavletWallet } from "@mavrykdynamics/webmavryk-mavlet-wallet";
import {
  AccountInfo,
  MavletEvent,
  NetworkType,
} from "@mavrykdynamics/mavlet-dapp";
import { MavrykToolkit } from "@mavrykdynamics/webmavryk";
import type { MavletWallet as MavletWalletType } from "@mavrykdynamics/webmavryk-mavlet-wallet";

// consts
import {
  atlasNetRpcnode,
  RPC_NODE,
  rpcNodeSchema,
  RPCNodeType,
} from "../../constants";

// utils
import { getItemFromStorage } from "../../utils/localStorage";

// Need to use as cuz NetworkType is enum and ts don't understand that all types are correct
const WALLET_NETWORK = "atlasnet" as NetworkType;
const DAPP_METADATA = {
  // name: process.env.REACT_APP_NAME,
  name: "Maven",
  preferredNetwork: WALLET_NETWORK,
  disableDefaultEvents: false,
};

const getRpcNode = (): RPCNodeType => {
  const rpcNode =
    getItemFromStorage<RPCNodeType>(RPC_NODE, rpcNodeSchema) ?? atlasNetRpcnode;
  return rpcNode;
};

export function dappClient() {
  let instance: MavletWalletType | undefined;

  function init() {
    return new MavletWallet(DAPP_METADATA);
  }

  function loadWallet() {
    if (!instance) instance = init();
    return instance;
  }

  function getDAppClient() {
    return loadWallet().client;
  }

  function getDAppClientWallet() {
    return loadWallet();
  }

  async function listenToActiveAccount(setAccount: (acc: AccountInfo) => void) {
    const client = getDAppClient();

    client
      .subscribeToEvent(MavletEvent.ACTIVE_ACCOUNT_SET, (account) => {
        // An active account has been set, update the dApp UI
        console.log(
          `${MavletEvent.ACTIVE_ACCOUNT_SET} triggered: `,
          account.address,
        );

        setAccount(account ?? null);
      })
      .catch((err) => {
        throw err;
      });
  }

  async function connectAccount() {
    try {
      const client = getDAppClient();
      await client.requestPermissions({
        network: {
          type: WALLET_NETWORK,
          rpcUrl: getRpcNode(),
        },
      });
    } catch (error) {
      console.log("request account error:", error);
      throw error;
    }
  }

  function mavryk() {
    const wallet = getDAppClientWallet();
    const Mavryk = new MavrykToolkit(getRpcNode());

    if (wallet) Mavryk.setWalletProvider(wallet);

    return Mavryk;
  }

  async function disconnectWallet() {
    try {
      const wallet = getDAppClientWallet();
      await wallet.disconnect();
      await wallet.clearActiveAccount();
    } catch (error) {
      console.log("disconnectWallet error:", error);
      throw error;
    }
  }

  return {
    listenToActiveAccount,
    loadWallet,
    getDAppClient,
    connectAccount,
    mavryk,
    disconnectWallet,
  };
}
