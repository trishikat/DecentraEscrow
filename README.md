# DecentraEscrow

A local Ethereum escrow dApp that allows a buyer to securely lock ETH in a smart contract and release or refund the funds according to the escrow state.

## Overview

DecentraEscrow demonstrates how a blockchain-based escrow workflow can be implemented using Solidity, Hardhat, ethers.js, MetaMask, and React.

The smart contract:

* Stores ETH in an escrow contract.
* Records the buyer and seller addresses.
* Allows only the buyer to release funds to the seller.
* Allows only the buyer to request a refund.
* Tracks the escrow lifecycle using explicit contract states.
* Prevents release or refund after the escrow has already been completed.

The project currently runs entirely on a local Hardhat blockchain using test ETH.

## Features

* Buyer and seller address management
* ETH escrow funding during contract deployment
* Buyer-controlled fund release
* Buyer-controlled refund
* Escrow status tracking
* Escrow balance checking
* MetaMask wallet connection
* React frontend
* Automated Solidity/TypeScript tests
* Local Hardhat blockchain development

## Tech Stack

* Solidity
* Hardhat 3
* ethers.js
* TypeScript
* React
* Vite
* MetaMask
* Chai

## Project Structure

```text
DecentraEscrow/
├── contracts/
│   └── DecentraEscrow.sol
├── scripts/
│   └── deploy.ts
├── test/
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── escrowABI.js
│   │   ├── EscrowApp.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── ...
├── hardhat.config.ts
├── package.json
└── README.md
```

## Smart Contract

The main contract is:

```text
contracts/DecentraEscrow.sol
```

The escrow has four possible states:

* `Created`
* `Funded`
* `Released`
* `Refunded`

The contract is funded when it is deployed with ETH.

### Release

Only the buyer can call:

```solidity
releaseFunds()
```

When released:

1. The escrow status changes to `Released`.
2. The escrowed ETH is transferred to the seller.
3. The escrow can no longer be released or refunded.

### Refund

Only the buyer can call:

```solidity
refundBuyer()
```

When refunded:

1. The escrow status changes to `Refunded`.
2. The escrowed ETH is returned to the buyer.
3. The escrow can no longer be released or refunded.

### Balance

The contract provides:

```solidity
getBalance()
```

This allows the frontend to check how much ETH is currently held by the escrow contract.

## Testing

The project includes automated tests covering:

* Escrow creation and funding
* Buyer-controlled fund release
* Buyer refund
* Unauthorized release attempts
* Unauthorized refund attempts

Run the complete test suite with:

```bash
npx hardhat test
```

The test suite currently contains 5 passing tests.

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

The local blockchain uses:

```text
RPC URL: http://127.0.0.1:8545/
Chain ID: 31337
```

### 3. Deploy the escrow contract

In another terminal, from the project root:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

The deployment script deploys the escrow contract using a local Hardhat account and funds the escrow with local test ETH.

The deployment script prints the deployed contract address.

> The contract address can change when the local blockchain is restarted or the contract is redeployed. If the address changes, update the address used by the frontend.

### 4. Configure MetaMask

Add the local Hardhat network to MetaMask:

* **Network:** `Hardhat Local`
* **RPC URL:** `http://127.0.0.1:8545/`
* **Chain ID:** `31337`

Import one of the Hardhat test accounts into MetaMask if required.

**Never use a real wallet private key or real ETH for this local setup.**

This project is designed for local development and testing.

### 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

For example:

```text
http://localhost:5176/
```

The port may be different if the Vite development server selects another available port.

## Frontend

The React frontend provides:

* MetaMask connection
* Connected account display
* Escrow balance lookup
* Escrow status lookup
* Release funds interaction
* Refund funds interaction
* Visual escrow status indicators
* Disabled actions when the escrow is no longer funded

The frontend communicates with the deployed `DecentraEscrow` contract through `ethers.js`.

### Frontend Workflow

A typical local workflow is:

1. Start the Hardhat blockchain.
2. Deploy the escrow contract.
3. Configure MetaMask to use `Hardhat Local`.
4. Connect MetaMask to the frontend.
5. Check the escrow balance.
6. Check the escrow status.
7. If the escrow is `Funded`, either:

   * Release the funds to the seller, or
   * Refund the funds to the buyer.
8. After release or refund, the escrow becomes inactive and the corresponding actions are disabled.

## Current Local Deployment

The frontend can be configured to interact with the currently deployed local contract.

Example local contract address:

```text
0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e
```

This address is specific to the current local Hardhat deployment and should not be treated as a permanent contract address.

## Security Note

This project is intended for local development and educational purposes.

* Use only Hardhat test accounts.
* Use only local test ETH.
* Never enter a real wallet's private key into this project.
* Never send real ETH to the local development contract.
* Never use the Hardhat test accounts on a real network.

## License

This project is licensed under the MIT License.
