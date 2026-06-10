import { NetworkType } from "@mavrykdynamics/mavlet-types"
import { ConfigType } from "./lib/Types"

const Config: ConfigType = await fetch("/config.json").then((c) => c.json())

// Allow VITE_* env vars to override config.json values.
// Set these in Cloudflare Pages, Vercel, or a .env file.
const e = import.meta.env
if (e.VITE_APP_NAME) Config.application.name = e.VITE_APP_NAME
if (e.VITE_BACKEND_URL) Config.application.backendUrl = e.VITE_BACKEND_URL
if (e.VITE_CAPTCHA_SITE_KEY) Config.application.googleCaptchaSiteKey = e.VITE_CAPTCHA_SITE_KEY
if (e.VITE_API_MAVRYK_URL) Config.application.apiMavrykUrl = e.VITE_API_MAVRYK_URL
if (e.VITE_GITHUB_REPO) Config.application.githubRepo = e.VITE_GITHUB_REPO
if (e.VITE_MAINTENANCE) Config.application.maintenance = e.VITE_MAINTENANCE === "true"
if (e.VITE_NETWORK_NAME) Config.network.name = e.VITE_NETWORK_NAME
if (e.VITE_RPC_URL) Config.network.rpcUrl = e.VITE_RPC_URL
if (e.VITE_VIEWER) Config.network.viewer = e.VITE_VIEWER

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
Config.application.isMavletWallet = false

const network = networkKeys.find(
  (x) => NetworkType[x].toLowerCase() === configNetwork
)
if (!network) {
  throw new Error(
    `Unknown network.name "${Config.network.name}" in config.json. If you did not make any typos, please consider updating Mavryk support NPM packages to get latest networks support:\n - @mavrykdynamics/mavlet-types\n - @mavrykdynamics/...`
  )
}

Config.network.networkType = NetworkType[network]
Config.application.isMavletWallet = !!Config.network.networkType
Config.application.disableChallenges =
Config.application.disableChallenges === true

// Fetch backend-owned settings from /info (limits, challenge config).
// These are the source of truth and override any config.json values.
try {
  const info = await fetch(`${Config.application.backendUrl}/info`).then((r) =>
    r.json()
  )
  Config.application.disableChallenges = !info.challengesEnabled
} catch (err) {
  console.error("Failed to fetch /info from backend:", err)
}

export default Config
