# DecentraEscrow

A local Ethereum escrow dApp that allows a buyer to securely lock ETH in a smart contract and release or refund the funds according to the escrow state.

## Overview

DecentraEscrow demonstrates how a blockchain-based escrow workflow can be implemented using Solidity, Hardhat, ethers.js, MetaMask, and React.

The smart contract:

- Stores ETH in an escrow contract.
- Records the buyer and seller addresses.
- Allows only the buyer to release funds to the seller.
- Allows only the buyer to request a refund.
- Tracks the escrow lifecycle using explicit contract states.
- Prevents release or refund after the escrow has already been completed.

The project currently runs entirely on a local Hardhat blockchain using test ETH.

## Features

- Buyer and seller address management
- ETH escrow funding during contract deployment
- Buyer-controlled fund release
- Buyer-controlled refund
- Escrow status tracking
- Escrow balance checking
- MetaMask wallet connection
- React frontend
- Automated Solidity/TypeScript tests

## Tech Stack

- Solidity
- Hardhat 3
- ethers.js
- TypeScript
- React
- Vite
- MetaMask
- Chai

## Smart Contract

The main contract is:

`contracts/DecentraEscrow.sol`

The escrow has four possible states:

- `Created`
- `Funded`
- `Released`
- `Refunded`

The contract is funded when it is deployed with ETH.

### Release

Only the buyer can call `releaseFunds()`.

When released:

1. The escrow status changes to `Released`.
2. The escrowed ETH is transferred to the seller.

### Refund

Only the buyer can call `refundBuyer()`.

When refunded:

1. The escrow status changes to `Refunded`.
2. The escrowed ETH is returned to the buyer.

## Testing

The project includes automated tests covering:

- Escrow creation and funding
- Buyer-controlled fund release
- Buyer refund
- Unauthorized release attempts
- Unauthorized refund attempts

Run the complete test suite with:

```bash
npx hardhat test
```

## Running Locally

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Start the local Hardhat blockchain

```bash
npx hardhat node
```

Keep this terminal running.

### 3. Deploy the escrow contract

Use the project's deployment script with the local Hardhat network.

The seller address must be supplied when deploying the contract, and the escrow is funded with local test ETH.

### 4. Configure MetaMask

Add the local Hardhat network to MetaMask:

- **Network:** `Hardhat Local`
- **RPC URL:** `http://127.0.0.1:8545/`
- **Chain ID:** `31337`

Import one of the Hardhat test accounts into MetaMask if required.

**Never use a real wallet private key or real ETH for this local setup.**

### 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Frontend

The React frontend provides:

- MetaMask connection
- Connected account display
- Escrow balance lookup
- Release funds interaction

The frontend communicates with the deployed `DecentraEscrow` contract through `ethers.js`.