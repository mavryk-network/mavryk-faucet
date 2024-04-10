import { NetworkType } from "@mavrykdynamics/beacon-types"
import { ConfigType } from "./lib/Types"

const Config: ConfigType = await fetch("/config.json").then((c) => c.json())

const networkKeys = Object.keys(NetworkType) as [keyof typeof NetworkType]

let configNetwork = Config.network.name
if (!configNetwork || configNetwork.trim() === "") {
  throw new Error(
    `config.json is missing the network.name property. Please set network.name to one of: ${networkKeys
      .map((x) => `"${NetworkType[x].toLowerCase()}"`)
      .join(", ")}`
  )
}

configNetwork = configNetwork.toLowerCase()

Config.network.networkType = undefined
Config.application.isBeaconWallet = false

const network = networkKeys.find(
  (x) => NetworkType[x].toLowerCase() === configNetwork
)
if (!network) {
  throw new Error(
    `Unknown network.name "${Config.network.name}" in config.json. If you did not make any typos, please consider updating Mavryk support NPM packages to get latest networks support:\n - @mavrykdynamics/beacon-sdk\n - @mavrykdynamics/...`
  )
}

Config.network.networkType = NetworkType[network]
Config.application.isBeaconWallet = !!Config.network.networkType
Config.application.disableChallenges =
Config.application.disableChallenges === true

export default Config
