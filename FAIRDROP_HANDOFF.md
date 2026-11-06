# FairDrop — Project Handoff

## 1. Project Overview
- Product: Walletless, proof-of-humanity-based distribution for limited event merchandise.
- MVP objective: Let an attendee claim once per campaign without connecting a wallet or paying gas.
- Intended flow: Browse campaign → World ID proof → backend verification → relayed Sepolia claim → receipt.
- Current status: Phase 1 UI and Phase 2 smart contract are implemented. Frontend and contract builds pass; all 16 contract tests pass. No contract is deployed.

## 2. Locked Architecture
- Frontend: Next.js App Router + TypeScript + Tailwind CSS.
- Backend: Next.js API routes (not implemented).
- Smart contract: Solidity / Foundry / OpenZeppelin on Ethereum Sepolia.
- World ID: Official World IDKit (not installed or implemented).
- Database: Supabase PostgreSQL (not configured).
- Network: Sepolia, chain ID 11155111.
- Relayer: Backend-owned key and gas funding; no attendee wallet (not implemented).

## 3. Technology and Versions
- Node: v25.6.1 observed in environment.
- npm: 11.9.0 observed in environment.
- Frontend dependencies installed; resolved versions are recorded in `package-lock.json`. Next.js 15.5.29 observed in the production build.
- Foundry v1.9.0-Homebrew installed.
- Solidity compiler package 0.8.28 is pinned exactly in `package.json` and `package-lock.json`; foundry uses `script/solcjs-wrapper` because its native compiler download/cache is blocked in this environment.
- OpenZeppelin Contracts 5.4.0 is pinned exactly in `package.json` and `package-lock.json`.

## 4. Repository Structure
```text
app/                  App Router pages and global styles
components/           Navbar, Footer, CampaignCard
lib/campaigns.ts      Illustrative sample campaign metadata
contracts/FairDrop.sol Campaign and claim contract
test/FairDrop.t.sol   Foundry unit tests
test/TestBase.sol     Minimal Foundry cheatcode interface and assertions
script/Deploy.s.sol   Sepolia deployment script (not executed)
script/ScriptBase.sol Minimal deployment-script cheatcode interface
script/solcjs-wrapper Foundry-compatible adapter around solc-js
abi/FairDrop.json     Exported contract ABI
foundry.toml          Foundry configuration
remappings.txt        OpenZeppelin npm remapping
package-lock.json     Resolved frontend dependency versions
FAIRDROP_HANDOFF.md   This handoff
```

## 5. Implementation Progress
- Phase 1 — COMPLETE: UI foundation; lint, TypeScript, and production build pass.
- Phase 2 — COMPLETE: Contract compiles and all 16 Foundry tests pass. Sepolia deployment was not performed because RPC and deployer configuration are absent.
- Phase 3 — NOT STARTED: World ID backend verification.
- Phase 4 — NOT STARTED: Supabase and relayer integration.
- Phase 5 — NOT STARTED: Full claim and organizer flows.
- Phase 6 — NOT STARTED: Final testing, deployment, and submission.

## 6. Current Implementation Details
- Landing page, campaign discovery, campaign details, receipt placeholder, and admin placeholder routes exist.
- Campaign data is explicitly illustrative. Claim action is disabled; no flow is represented as successful.
- `FairDrop.sol` implements campaign creation/update, activation, relayer changes, claims, and campaign/supply getters.
- `hasClaimed[campaignId][nullifierHash]` tracks claim uniqueness per campaign. Campaign IDs begin at 1.
- Foundry tests cover creation, multiple campaigns, zero supply, valid/duplicate/different nullifiers, nullifier reuse across campaigns, unauthorized relayer, inactive/not-started/expired/sold-out campaigns, owner-only administration, invalid relayer, and unknown campaign. All 16 pass.
- No API endpoints or database tables exist.

## 7. Smart Contract Details
- Contract: `contracts/FairDrop.sol`; compiler target 0.8.28.
- Network target: Sepolia, chain ID 11155111. No deployment.
- Storage: `nextCampaignId`, `relayer`, private campaign mapping, public `hasClaimed` mapping; admin ownership via OpenZeppelin `Ownable`.
- Functions: `createCampaign`, `updateCampaign`, `setCampaignActive`, `setRelayer`, `claim`, `getCampaign`, `campaignExists`, `remainingSupply`.
- Events: `CampaignCreated`, `CampaignUpdated`, `CampaignActiveChanged`, `RelayerChanged`, `Claimed`.
- Security model: Backend must verify the World ID proof before a relayer submits `claim`. The contract trusts its configured relayer and does not verify World ID proofs. `claim` makes no external calls.
- ABI path: `abi/FairDrop.json` (exported from the verified build artifact).
- Deployment script reads `DEPLOYER_PRIVATE_KEY` and `FAIRDROP_RELAYER_ADDRESS`; it is not run.

## 8. World ID Integration
- SDK/version/config/action/signal/verification: Not implemented.
- No proof is generated or accepted.

## 9. Database
- No schema, migrations, or RLS policies exist.

## 10. API Documentation
- No API endpoints exist.

## 11. Environment Setup
- Frontend: no required runtime environment variables.
- Contract deploy script: `DEPLOYER_PRIVATE_KEY`, `FAIRDROP_RELAYER_ADDRESS`.
- Sepolia broadcast requires `SEPOLIA_RPC_URL` and deployer credentials. No values are present in the project.

## 12. Commands
- Install frontend: `npm install` (completed).
- Lint: `npm run lint` (verified pass).
- Type checks: `npm run typecheck` (verified pass).
- Frontend build: `npm run build` (verified pass).
- Dev: `npm run dev` (declared, not run).
- Contract build: `forge build --root .` (verified pass; uses the local solc-js adapter configured in `foundry.toml`).
- Contract tests: `forge test --root .` (verified pass; 16 passed).
- Solidity formatting: `forge fmt --check --root .` (verified pass).
- Sepolia deployment: `forge script script/Deploy.s.sol --broadcast --rpc-url $SEPOLIA_RPC_URL` (not verified).

## 13. Test Results
- 2026-11-06 — `npm run lint` — PASS.
- 2026-11-06 — `npm run typecheck` — PASS.
- 2026-11-06 — `npm run build` — PASS; routes were statically generated where configured.
- 2026-11-07 — `forge build --root .` — PASS with Solidity 0.8.28; three non-fatal timestamp warnings and a non-fatal global Foundry signature-cache warning appear.
- 2026-11-07 — `forge test --root .` — PASS; 16 passed, 0 failed, 0 skipped.
- 2026-11-07 — `forge fmt --check --root .` — PASS.

## 14. Known Issues and Blockers
- Sepolia RPC and deployment credentials are not configured; deployment requires them.
- Foundry emits a non-fatal warning when it cannot write its global signature cache under `~/.foundry/cache`; builds and tests still pass.
- Solidity compiler warnings note `block.timestamp` comparisons; these enforce the specified campaign start/end boundaries.
- npm reported dependency vulnerabilities during installs; the final install output listed 10 total (1 low, 7 moderate, 2 high). Audit details have not been reviewed.
- The project is isolated in its own Git repository so the home-directory Git worktree and its unrelated changes are not included in FairDrop commits.

## 15. Recent Changes
- 2026-11-06 — Phase 1 — Added Next.js/Tailwind foundation, shared navigation/footer, initial routes, illustrative campaign data, and handoff. Installed dependencies and passed lint, typecheck, and build.
- 2026-11-07 — Phase 2 — Added campaign/claim contract, Foundry tests and deployment script, pinned npm compiler/OpenZeppelin packages, local solc-js wrapper, and exported ABI. `forge build`, `forge fmt --check`, and all 16 `forge test` cases pass.
- 2026-11-07 — Repository preparation — Added project README, expanded generated-file and local-secret ignores, and prepared a project-local Git repository for the first push.

## 16. Current Stopping Point
- Last completed phase: Phase 2.
- Current phase: Phase 2 complete; waiting for approval to start Phase 3.
- Last completed task: Contract compilation, format check, and 16 unit tests.
- Current task: None in this phase.
- Exact next task: After explicit approval, inspect official World IDKit documentation and begin Phase 3 backend proof verification.
- Frontend and contract project are confirmed runnable with their documented commands.

## 17. Instructions for the Next AI Agent
- Read this file first and inspect the actual repository.
- Do not recreate existing code or disturb unrelated home-directory Git changes.
- Verify implementation and dependency versions before continuing.
- Continue the six-phase workflow in order; ask before advancing phases.
- Do not claim live World ID, blockchain, inventory, or receipt behavior until actually implemented and verified.
