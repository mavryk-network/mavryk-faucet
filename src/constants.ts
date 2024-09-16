import { z } from "zod";
import Config from "./Config";

export const atlasNetRpcnode = Config.network.rpcUrl;
export const RPC_NODE = "selectedRpcNode";
export const rpcNodeSchema = z.enum([atlasNetRpcnode]);
export type RPCNodeType = z.infer<typeof rpcNodeSchema>;
