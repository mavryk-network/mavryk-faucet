# get-mav

This zero dependency package provides a programmatic interface to interact with the [Tezos faucet](https://github.com/oxheadalpha/tezos-faucet-backend). It is a script that can be run from a JavaScript/Typescript program or directly from a shell. Your NodeJS version should support the [`fetch`](https://nodejs.org/dist/latest-v18.x/docs/api/globals.html#fetch) api.

## Installation

You can install the package from npm:

```bash
npm install @mavrykdynamics/get-mav
```

## Usage

### JS / TS

After installing the package, you can import it in your Node.js JavaScript or TypeScript project:

```javascript
const getMav = require("@mavrykdynamics/get-mav")

// OR

import getMav from "@mavrykdynamics/get-mav"
```

You can then use the `getMav` function to interact with the Mavryk faucet. The function takes an object as an argument, with the following properties:

- `address`: The address to send Mav to. This can be a raw Mavryk public key hash or a local address's alias.
- `amount`: The amount of Mav to request.
- `network`: The faucet's network name. Must match a network name with a faucet listed at https://teztnets.xyz. Ignored if `faucetUrl` is set.
- `faucetUrl`: The custom faucet URL. Ignores `network`.
- `clientDir`: (Optional) Specifies a custom client directory path to look up an address alias. If not set, it will default to `$HOME/.tezos-client/` or `$TEZOS_CLIENT_DIR` if the `TEZOS_CLIENT_DIR` environment variable is set.

Here is an example of how to use the `getMav` function:

```javascript
const txHash = await getMav({
  address: "mv1...",
  amount: 10,
  network: "ghostnet",
})
// txHash: ooaEskbj...
```

Using an address alias:

```javascript
const txHash = await getMav({
  address: "alice",
  amount: 10,
  network: "ghostnet",
})
// txHash: ooaEskbj...
```

Example using the `faucetUrl` parameter:

```js
const txHash = await getMav({
  address: "mv1...",
  amount: 10,
  faucetUrl: "https://my-custom-faucet-url.com",
})
// txHash: ooaEskbj...
```

### CLI

You can also run `get-mav` directly from the command line with `npx`:

```bash
npx @mavrykdynamics/get-mav mv1... --amount 10 --network basenet
```

Run the script with the `--help` flag for more information.
