// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title FairDrop
/// @notice Manages limited merchandise campaigns and enforces one claim per
///         World ID nullifier for each campaign.
/// @dev World ID proofs are verified off-chain. This contract trusts only the
///      configured relayer to submit a claim after successful verification.
contract FairDrop is Ownable {
    struct Campaign {
        uint256 campaignId;
        string metadataURI;
        uint64 totalSupply;
        uint64 totalClaimed;
        uint64 startTimestamp;
        uint64 endTimestamp;
        bool active;
    }

    error UnauthorizedRelayer(address caller);
    error CampaignNotFound(uint256 campaignId);
    error InvalidSupply();
    error InvalidCampaignPeriod();
    error SupplyBelowClaimed(uint64 proposedSupply, uint64 totalClaimed);
    error CampaignInactive(uint256 campaignId);
    error CampaignNotStarted(uint256 campaignId, uint64 startTimestamp);
    error CampaignEnded(uint256 campaignId, uint64 endTimestamp);
    error AlreadyClaimed(uint256 campaignId, bytes32 nullifierHash);
    error SoldOut(uint256 campaignId);
    error InvalidRelayer();

    event CampaignCreated(uint256 indexed campaignId, string metadataURI, uint64 totalSupply);
    event CampaignUpdated(
        uint256 indexed campaignId, string metadataURI, uint64 totalSupply, uint64 startTimestamp, uint64 endTimestamp
    );
    event CampaignActiveChanged(uint256 indexed campaignId, bool active);
    event RelayerChanged(address indexed previousRelayer, address indexed newRelayer);
    event Claimed(uint256 indexed campaignId, bytes32 indexed nullifierHash, uint64 totalClaimed);

    uint256 public nextCampaignId = 1;
    address public relayer;

    mapping(uint256 campaignId => Campaign campaign) private _campaigns;
    mapping(uint256 campaignId => mapping(bytes32 nullifierHash => bool claimed)) public hasClaimed;

    modifier onlyRelayer() {
        if (msg.sender != relayer) revert UnauthorizedRelayer(msg.sender);
        _;
    }

    constructor(address initialOwner, address initialRelayer) Ownable(initialOwner) {
        if (initialRelayer == address(0)) revert InvalidRelayer();
        relayer = initialRelayer;
        emit RelayerChanged(address(0), initialRelayer);
    }

    /// @notice Creates a campaign. Its start and end timestamps are inclusive.
    function createCampaign(string calldata metadataURI, uint64 totalSupply, uint64 startTimestamp, uint64 endTimestamp)
        external
        onlyOwner
        returns (uint256 campaignId)
    {
        _validateCampaign(totalSupply, startTimestamp, endTimestamp);

        campaignId = nextCampaignId++;
        _campaigns[campaignId] = Campaign({
            campaignId: campaignId,
            metadataURI: metadataURI,
            totalSupply: totalSupply,
            totalClaimed: 0,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
            active: true
        });

        emit CampaignCreated(campaignId, metadataURI, totalSupply);
    }

    /// @notice Updates campaign metadata, supply, and time window.
    /// @dev Supply cannot be reduced below claims already recorded.
    function updateCampaign(
        uint256 campaignId,
        string calldata metadataURI,
        uint64 totalSupply,
        uint64 startTimestamp,
        uint64 endTimestamp
    ) external onlyOwner {
        Campaign storage campaign = _requireCampaign(campaignId);
        _validateCampaign(totalSupply, startTimestamp, endTimestamp);
        if (totalSupply < campaign.totalClaimed) {
            revert SupplyBelowClaimed(totalSupply, campaign.totalClaimed);
        }

        campaign.metadataURI = metadataURI;
        campaign.totalSupply = totalSupply;
        campaign.startTimestamp = startTimestamp;
        campaign.endTimestamp = endTimestamp;
        emit CampaignUpdated(campaignId, metadataURI, totalSupply, startTimestamp, endTimestamp);
    }

    function setCampaignActive(uint256 campaignId, bool active) external onlyOwner {
        Campaign storage campaign = _requireCampaign(campaignId);
        campaign.active = active;
        emit CampaignActiveChanged(campaignId, active);
    }

    function setRelayer(address newRelayer) external onlyOwner {
        if (newRelayer == address(0)) revert InvalidRelayer();
        address previousRelayer = relayer;
        relayer = newRelayer;
        emit RelayerChanged(previousRelayer, newRelayer);
    }

    /// @notice Records a claim after the backend has verified the World ID proof.
    function claim(uint256 campaignId, bytes32 nullifierHash) external onlyRelayer {
        Campaign storage campaign = _requireCampaign(campaignId);
        if (!campaign.active) revert CampaignInactive(campaignId);
        if (block.timestamp < campaign.startTimestamp) {
            revert CampaignNotStarted(campaignId, campaign.startTimestamp);
        }
        if (block.timestamp > campaign.endTimestamp) {
            revert CampaignEnded(campaignId, campaign.endTimestamp);
        }
        if (hasClaimed[campaignId][nullifierHash]) {
            revert AlreadyClaimed(campaignId, nullifierHash);
        }
        if (campaign.totalClaimed >= campaign.totalSupply) revert SoldOut(campaignId);

        hasClaimed[campaignId][nullifierHash] = true;
        campaign.totalClaimed += 1;
        emit Claimed(campaignId, nullifierHash, campaign.totalClaimed);
    }

    function getCampaign(uint256 campaignId) external view returns (Campaign memory) {
        return _requireCampaignView(campaignId);
    }

    function campaignExists(uint256 campaignId) external view returns (bool) {
        return _campaigns[campaignId].campaignId != 0;
    }

    function remainingSupply(uint256 campaignId) external view returns (uint64) {
        Campaign storage campaign = _requireCampaignView(campaignId);
        return campaign.totalSupply - campaign.totalClaimed;
    }

    function _validateCampaign(uint64 totalSupply, uint64 startTimestamp, uint64 endTimestamp) private view {
        if (totalSupply == 0) revert InvalidSupply();
        if (endTimestamp <= startTimestamp || endTimestamp < block.timestamp) revert InvalidCampaignPeriod();
    }

    function _requireCampaign(uint256 campaignId) private view returns (Campaign storage campaign) {
        campaign = _campaigns[campaignId];
        if (campaign.campaignId == 0) revert CampaignNotFound(campaignId);
    }

    function _requireCampaignView(uint256 campaignId) private view returns (Campaign storage campaign) {
        campaign = _campaigns[campaignId];
        if (campaign.campaignId == 0) revert CampaignNotFound(campaignId);
    }
}
