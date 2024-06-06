#!/usr/bin/env node
import * as crypto from "crypto"
import * as fs from "fs"
import * as path from "path"
import * as pkgJson from "./package.json"

const isMainModule = require.main === module

/*
We instantiate a "Console" to stderr for logging so that logs are not written to
stdout when the script is run from the CLI. We want the transaction hash to be
the only stdout once the Mav is sent to the user.
*/
import { Console } from "console"
const console = new Console(isMainModule ? process.stderr : process.stdout)
const { log } = console

let VERBOSE: boolean, TIME: boolean

const verboseLog = (message: any) => VERBOSE && log(message)

const [time, timeLog, timeEnd] = [
  console.time,
  console.timeLog,
  console.timeEnd,
].map(
  (f: Function) =>
    (...a: any[]) =>
      TIME && f(...a)
)

const displayHelp = () => {
  log(`CLI Usage: npx @mavrykdynamics/get-mav [options] <address>

<address>:
  The address where Mav should be sent. This can be either a standard Mavryk public key hash (e.g. mv1234abc...)
  or a local alias. If an alias is provided (e.g., 'alice'), the program will attempt to resolve it to a public
  key hash by looking it up in the specified client directory, set by --client-dir or by the TEZOS_CLIENT_DIR
  environment variable. If neither is set, the default lookup location is $HOME/.tezos-client.

Options:
  -h, --help                Display help information.
  -a, --amount     <value>  The amount of Mav to request.
  -n, --network    <value>  Set the faucet's network name. Must match a
                            network name with a faucet listed at https://teztnets.xyz.
                            Ignored if --faucet-url is set.
  -f, --faucet-url <value>  Set the custom faucet URL. Ignores --network.
  -d, --client-dir <value>  Custom client directory path to look up an address alias.
  -t, --time                Enable PoW challenges timer.
  -v, --verbose             Enable verbose logging.
      --version             Log the package version.`)
}

const DISPLAY_HELP = isMainModule && true

const handleError = (message: string, help?: boolean) => {
  if (isMainModule) {
    log(`ERROR: ${message}\n`)
    help && displayHelp()
    process.exit(1)
  } else {
    help && displayHelp()
    throw new Error(message)
  }
}

const DEFAULT_CLIENT_DIR =
  process.env.TEZOS_CLIENT_DIR || path.join(process.env.HOME!, ".tezos-client")

const resolveAliasToPkh = (
  alias: string,
  clientDir: string = DEFAULT_CLIENT_DIR
): string | null => {
  const pkhsFilePath = path.join(clientDir, "public_key_hashs")
  if (fs.existsSync(pkhsFilePath)) {
    const pkhsData: Array<{ name: string; value: string }> = JSON.parse(
      fs.readFileSync(pkhsFilePath, "utf8")
    )
    return pkhsData.find(({ name }) => name === alias)?.value || null
  }
  return null
}

type GetMavArgs = {
  /** The address to send Mav to. */
  address: string
  /** The amount of Mav to request. */
  amount: number
  /** Custom client directory path to look up address alias. */
  clientDir?: string
  /** Set the faucet's network name. Must match a network name with a faucet
   * listed at https://teztnets.xyz. Ignored if `faucetUrl` is set. */
  network?: string
  /** Set the custom faucet URL. Ignores `network`. */
  faucetUrl?: string
  /** Enable verbose logging. */
  verbose?: boolean
  /** Enable PoW challenges timer */
  time?: boolean
}

const parseCliArgs = (args: string | string[]): GetMavArgs => {
  if (typeof args === "string") args = args.split(" ")

  const parsedArgs: GetMavArgs = {
    address: "",
    amount: 0,
    network: "",
    faucetUrl: "",
  }

  while (args.length > 0) {
    const arg = args.shift()
    switch (arg) {
      case "-h":
      case "--help":
        if (isMainModule) {
          displayHelp()
          process.exit(0)
        } else {
          throw new Error("'--help' passed")
        }
      case "-a":
      case "--amount":
        parsedArgs.amount = Number(args.shift())
        break
      case "-n":
      case "--network":
        parsedArgs.network = args.shift()?.toLowerCase() || ""
        break
      case "-f":
      case "--faucet-url":
        parsedArgs.faucetUrl = args.shift() || ""
        break
      case "-d":
      case "--client-dir":
        const clientDir = args.shift()
        if (!clientDir) {
          handleError(`The ${arg} flag expects an argument.`, DISPLAY_HELP)
        }
        parsedArgs.clientDir = clientDir
        break
      case "-v":
      case "--verbose":
        VERBOSE = true
        break
      case "-t":
      case "--time":
        TIME = true
        break
      case "--version":
        log(pkgJson.version)
        process.exit(0)
      default:
        if (!parsedArgs.address) {
          parsedArgs.address = arg || ""
        } else {
          handleError(`Unexpected argument provided: '${arg}'`, DISPLAY_HELP)
        }
        break
    }
  }

  return parsedArgs
}

type ValidatedArgs = Required<Omit<GetMavArgs, "verbose" | "time" | "network">>

const validateArgs = async (args: GetMavArgs): Promise<ValidatedArgs> => {
  if (args.clientDir && !fs.existsSync(args.clientDir)) {
    handleError(`Client dir '${args.clientDir}' doesn't exist.`)
  }

  if (!args.address) {
    handleError("Mavryk address is required.", DISPLAY_HELP)
  } else if (!args.address.startsWith("mv")) {
    const resolvedAddress = resolveAliasToPkh(args.address, args.clientDir)
    if (!resolvedAddress) {
      handleError(`Alias '${args.address}' not found.`)
    } else {
      args.address = resolvedAddress
    }
  }

  if (!args.amount || args.amount <= 0) {
    handleError("An amount greater than 0 is required.", DISPLAY_HELP)
  }

  if (!args.faucetUrl && !args.network) {
    handleError(
      "Either a network name or faucet URL is required.",
      DISPLAY_HELP
    )
  }

  if (!args.faucetUrl) {
    const teztnetsUrl = "https://testnets.mavryk.network/teztnets.json"
    const response = await fetch(teztnetsUrl, {
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) {
      handleError(`Error fetching networks from ${teztnetsUrl}`)
    }

    args.network = args.network?.toLowerCase()

    for (const net of Object.values(await response.json()) as any[]) {
      if (net.human_name.toLowerCase() === args.network) {
        args.faucetUrl = net.faucet_url
      }
    }

    if (!args.faucetUrl) {
      handleError("Network not found or not supported.")
    }
  }

  if (args.verbose) VERBOSE = true
  if (args.time) TIME = true

  return args as ValidatedArgs
}

const requestHeaders = {
  // To make it work with localhost, uncomment this.
  // But it breaks older versions of node.
  //Connection: "close",
  "Content-Type": "application/json",
}

/* Get Info */

const getInfo = async (faucetUrl: string) => {
  verboseLog("Requesting faucet info...")

  const response = await fetch(`${faucetUrl}/info`, {
    headers: requestHeaders,
    signal: AbortSignal.timeout(10_000),
  })

  const body = await response.json()

  if (!response.ok) {
    handleError(body.message)
  }

  return body
}

/* Get Challenge */

const getChallenge = async ({ address, amount, faucetUrl }: ValidatedArgs) => {
  verboseLog("Requesting PoW challenge...")

  const response = await fetch(`${faucetUrl}/challenge`, {
    method: "POST",
    headers: requestHeaders,
    signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({ address, amount }),
  })

  const body = await response.json()

  if (!response.ok) {
    handleError(body.message)
  }

  return body
}

/* Solve Challenge */

type SolveChallengeArgs = {
  challenge: string
  difficulty: number
  challengeCounter: number
  challengesNeeded: number
}

type Solution = {
  nonce: number
  solution: string
}

const solveChallenge = ({
  challenge,
  difficulty,
  challengeCounter,
  challengesNeeded,
}: SolveChallengeArgs): Solution => {
  const progress = Math.min(
    99,
    Number((((challengeCounter - 1) / challengesNeeded) * 100).toFixed(1))
  )

  if (isMainModule && process.stdout.isTTY) {
    // Overwrite the same line instead of printing multiple lines.
    process.stderr.clearLine(0)
    process.stderr.cursorTo(0)
    process.stderr.write(`Solving challenges... ${progress}% `)
  } else {
    verboseLog(`Solving challenges... ${progress}%`)
  }

  let nonce = 0
  time("solved")
  while (true) {
    const input = `${challenge}:${nonce}`
    const hash = crypto.createHash("sha256").update(input).digest("hex")
    if (hash.startsWith("0".repeat(difficulty))) {
      timeEnd("solved")
      timeLog("getMav time")
      verboseLog(`Solution found`)
      return { solution: hash, nonce }
    }
    nonce++
  }
}

/* Verify Solution */

type VerifySolutionArgs = Solution & ValidatedArgs

type VerifySolutionResult = {
  challenge?: string
  challengeCounter?: number
  difficulty?: number
  txHash?: string
}

const verifySolution = async ({
  address,
  amount,
  faucetUrl,
  nonce,
  solution,
}: VerifySolutionArgs): Promise<VerifySolutionResult> => {
  verboseLog("Verifying solution...")

  const response = await fetch(`${faucetUrl}/verify`, {
    method: "POST",
    headers: requestHeaders,
    signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({ address, amount, nonce, solution }),
  })

  const { txHash, challenge, challengeCounter, difficulty, message } =
    await response.json()

  if (!response.ok) {
    handleError(message)
  }

  if (txHash) {
    verboseLog(`Solution is valid`)
    verboseLog(`Mav sent! Check transaction: ${txHash}\n`)
    return { txHash }
  } else if (challenge && difficulty && challengeCounter) {
    verboseLog(`Solution is valid\n`)
    return { challenge, difficulty, challengeCounter }
  } else {
    handleError(`Error verifying solution: ${message}`)
  }
  return {}
}

/* Entrypoint */
const formatAmount = (amount: number) =>
  amount.toLocaleString(undefined, {
    maximumFractionDigits: 7,
  })

const getMav = async (args: GetMavArgs) => {
  try {
    const validatedArgs = await validateArgs(args)

    const { challengesEnabled, minMav, maxMav } = await getInfo(
      validatedArgs.faucetUrl
    )

    if (!(args.amount >= minMav && args.amount <= maxMav)) {
      handleError(
        `Amount must be between ${formatAmount(minMav)} and ${formatAmount(
          maxMav
        )} mav.`
      )
    }

    if (!challengesEnabled) {
      const txHash = (
        await verifySolution({ solution: "", nonce: 0, ...validatedArgs })
      )?.txHash
      return txHash
    }

    let { challenge, difficulty, challengeCounter, challengesNeeded } =
      await getChallenge(validatedArgs)

    time("getMav time")

    while (challenge && difficulty && challengeCounter && challengesNeeded) {
      verboseLog({ challenge, difficulty, challengeCounter })

      const { solution, nonce } = solveChallenge({
        challenge,
        difficulty,
        challengeCounter,
        challengesNeeded,
      })

      verboseLog({ nonce, solution })

      let txHash
        ; ({ challenge, difficulty, challengeCounter, txHash } =
          await verifySolution({ solution, nonce, ...validatedArgs }))

      if (txHash) {
        timeEnd("getMav time")
        return txHash
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      handleError("Connection timeout. Please try again.")
    } else {
      throw err
    }
  }
}

if (isMainModule) {
  // If the file is executed directly by node and not via import then argv will
  // include the file name.
  const args = process.argv.slice(isMainModule ? 2 : 1)
  const parsedArgs = parseCliArgs(args)

  log(`get-mav v${pkgJson.version} by Mavryk Dynamics - Get Free Mav\n`)

  getMav(parsedArgs).then(
    (txHash) => txHash && process.stderr.write("- Transfer done!\nOperation hash: ") &&
      process.stdout.write(txHash) && process.stderr.write("\n")
  )
}

// https://remarkablemark.org/blog/2020/05/05/typescript-export-commonjs-es6-modules
getMav.default = getMav
export = getMav
