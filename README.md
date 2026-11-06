# FairDrop

FairDrop is an MVP for fair, walletless distribution of limited event merchandise. Its intended claim flow uses World ID verification in a backend and a relayer to submit a claim on Ethereum Sepolia.

## Current status

The current prototype contains the first two project phases:

- A Next.js interface with campaign discovery, campaign detail, receipt, and organizer placeholder screens.
- A Solidity campaign and claim contract, Foundry tests, a deployment script, and the exported ABI.

Campaign content is illustrative. World ID verification, API routes, Supabase, relaying, and Sepolia deployment are not implemented yet. The UI does not submit a claim.

## Requirements

- Node.js and npm
- Foundry (`forge`) for contract build and tests

## Run the web prototype

```sh
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Verify

```sh
npm run lint
npm run typecheck
npm run build
forge build --root .
forge test --root .
forge fmt --check --root .
```

Foundry uses the pinned `solc` npm package through `script/solcjs-wrapper`.

## Deploying the contract

The deployment script expects `DEPLOYER_PRIVATE_KEY`, `FAIRDROP_RELAYER_ADDRESS`, and `SEPOLIA_RPC_URL`. No deployment has been performed. Keep credentials in a local, untracked environment file and never commit private keys.

## Project layout

- `app/`, `components/` — web interface
- `lib/campaigns.ts` — illustrative campaign data
- `contracts/` — Solidity contract
- `test/` — Foundry tests
- `script/` — deployment script and compiler adapter
- `abi/` — exported contract ABI
- `FAIRDROP_HANDOFF.md` — implementation status and handoff notes
