# Mavryk Faucet Frontend

(forked from https://github.com/oxheadalpha/tezos-faucet)

## Presentation

A one-click faucet for Mavryk, now enhanced with a PoW (Proof of Work) challenge to ensure secure and fair Mav distribution.

### Made with

- Typescript
- Vite
- React
- Bootstrap
- Taquito
- Beacon Wallet

## Overview

The faucet's backend code can be located at [tezos-faucet-backend](https://github.com/oxheadalpha/tezos-faucet-backend). The backend handles the faucet's private key, CAPTCHA secret, PoW challenge creation and solution verification, and the amounts of Mav sent.

### Proof of Work (PoW) Challenge

To mitigate potential abuse and ensure a fair distribution of Mav, users are now required to solve computational challenges before receiving their Mav. This PoW mechanism discourages bots and other malicious actors from exploiting the faucet.

### Application Flow

1. **Initiating the Process**: Upon a Mav request, the frontend communicates with the `/challenge` endpoint of the backend, providing essential details such as the user's address and the amount of Mav requested.
2. **Receiving and Solving the Challenge**: The backend then sends a challenge. The difficulty and amount of challenges to be solved depends on factors such as if a CAPTCHA token was submitted and how much Mav was requested. The browser will create a webworker which will begin the process of finding a solution.
3. **Submitting and Verifying the Solution**: After solving, the frontend sends the solution to the `/verify` endpoint. The backend then checks its validity. Assuming it is valid, if more challenges are pending, the user proceeds to solve them. Once all challenges are cleared, Mav is sent to the user's account.

## Programmatic Faucet Usage

For programmatic usage of the faucet, we provide an npm package `@mavryk-network/get-mav`. The code can be found [here](https://github.com/mavryk-network/mavryk-faucet/tree/main/getMav). Please refer to it for more details on how to use it. This script can be run from a JavaScript program or directly from a shell. It interacts with the backend to request Mav, solve the required challenges, and verify the solutions.

Please note that the programmatic faucet code does not use CAPTCHA and so more challenges can be given when using it.

## Setup

To setup the faucet for a new network:

1. Update Beacon Wallet lib to make sure it will handle the new network
2. Deploy a new instance of backend
3. Configure faucet to use backend
4. Deploy faucet

### 1. Update Beacon Wallet configuration for new network

Currently supported networks include:

- Mainnet
- Basenet
- Mondaynet
- Dailynet
- Atlasnet

To add a new network, first check that `@mavrykdynamics/beacon-sdk` handles it ([check their config on the latest release](https://github.com/airgap-it/beacon-sdk/blob/v4.0.6/packages/beacon-types/src/types/beacon/NetworkType.ts)), then update:

```
npm i @mavrykdynamics/beacon-sdk
```

### 2. Deploy backend

See https://github.com/oxheadalpha/tezos-faucet-backend

### 3. Update configuration file: `config.json`

**Application configuration:**

- `name`: application name, displayed in header

- `googleCaptchaSiteKey`: Google ReCAPTCHA public site key

- `backendUrl`: Base URL of faucet backend to connect to.

- `githubRepo`: URL of Github repository (displayed in header with Github icon).

- `disableChallenges`: If PoW challenges need to be solved before receiving Mav. The backend must also disable challenges. Defaults to `false`.

- `minMav`: The minimum amount of Mav that can be requested.
- `maxMav`: The maximum amount of Mav that can be requested.

**Network configuration:**

- `name`: network name. Must match one of [@mavrykdynamics/beacon-sdk NetworkType](https://github.com/airgap-it/beacon-sdk/blob/v4.0.6/packages/beacon-types/src/types/beacon/NetworkType.ts) value (case insensitive). Also used to be displayed.

- `rpcUrl`: Mavryk network RPC endpoint to be used by faucet

- `faucetAddress`: public Mavryk address of faucet

- `viewer`: URL of a block explorer that displays operation detail like `http://viewer-url.com/{tx_hash}` (eg. https://ghost.tzstats.com)

### 4. Deploy

Deploy with Docker using Dockerfile.

Build Docker image:

```
docker build . -t mavryk-faucet
```

Run Docker image:

```
docker run -p 8080:8080 mavryk-faucet
```
