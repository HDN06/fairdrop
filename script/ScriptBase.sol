// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/// @dev Minimal deployment-script cheatcodes used by this project.
interface VmScript {
    function envUint(string calldata name) external returns (uint256 value);
    function envAddress(string calldata name) external returns (address value);
    function addr(uint256 privateKey) external returns (address keyAddr);
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
}

abstract contract ScriptBase {
    VmScript internal constant vm = VmScript(address(uint160(uint256(keccak256("hevm cheat code")))));
}
