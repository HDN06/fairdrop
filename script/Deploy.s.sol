// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {FairDrop} from "../contracts/FairDrop.sol";
import {ScriptBase} from "./ScriptBase.sol";

contract DeployFairDrop is ScriptBase {
    function run() external returns (FairDrop fairDrop) {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address relayerAddress = vm.envAddress("FAIRDROP_RELAYER_ADDRESS");
        vm.startBroadcast(deployerPrivateKey);
        fairDrop = new FairDrop(vm.addr(deployerPrivateKey), relayerAddress);
        vm.stopBroadcast();
    }
}
