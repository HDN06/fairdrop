// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {FairDrop} from "../contracts/FairDrop.sol";
import {TestBase} from "./TestBase.sol";

contract FairDropTest is TestBase {
    FairDrop private fairDrop;
    address private constant RELAYER = address(0xBEEF);
    address private constant OTHER = address(0xCAFE);
    uint64 private start;
    uint64 private end;

    function setUp() public {
        start = uint64(block.timestamp);
        end = start + 1 days;
        fairDrop = new FairDrop(address(this), RELAYER);
    }

    function _create(uint64 supply) private returns (uint256) {
        return fairDrop.createCampaign("ipfs://campaign", supply, start, end);
    }

    function testCampaignCreationAndMultipleCampaigns() public {
        uint256 first = _create(10);
        uint256 second = fairDrop.createCampaign("https://example.test/2", 20, start, end);

        assertEq(first, 1);
        assertEq(second, 2);
        assertEq(fairDrop.nextCampaignId(), 3);
        assertTrue(fairDrop.campaignExists(first));
        assertEq(fairDrop.remainingSupply(second), 20);
        FairDrop.Campaign memory campaign = fairDrop.getCampaign(first);
        assertEq(campaign.metadataURI, "ipfs://campaign");
        assertEq(campaign.totalSupply, 10);
        assertTrue(campaign.active);
    }

    function testRejectsZeroSupply() public {
        vm.expectRevert(FairDrop.InvalidSupply.selector);
        _create(0);
    }

    function testValidClaimIncrementsInventory() public {
        uint256 campaignId = _create(10);
        bytes32 nullifier = keccak256("human-1");
        vm.prank(RELAYER);
        fairDrop.claim(campaignId, nullifier);

        assertTrue(fairDrop.hasClaimed(campaignId, nullifier));
        assertEq(fairDrop.getCampaign(campaignId).totalClaimed, 1);
        assertEq(fairDrop.remainingSupply(campaignId), 9);
    }

    function testRejectsDuplicateNullifierInCampaign() public {
        uint256 campaignId = _create(10);
        bytes32 nullifier = keccak256("human-1");
        vm.prank(RELAYER);
        fairDrop.claim(campaignId, nullifier);

        vm.expectRevert(abi.encodeWithSelector(FairDrop.AlreadyClaimed.selector, campaignId, nullifier));
        vm.prank(RELAYER);
        fairDrop.claim(campaignId, nullifier);
    }

    function testDifferentNullifierCanClaim() public {
        uint256 campaignId = _create(10);
        vm.startPrank(RELAYER);
        fairDrop.claim(campaignId, keccak256("human-1"));
        fairDrop.claim(campaignId, keccak256("human-2"));
        vm.stopPrank();
        assertEq(fairDrop.getCampaign(campaignId).totalClaimed, 2);
    }

    function testSameNullifierCanClaimInDifferentCampaigns() public {
        uint256 first = _create(10);
        uint256 second = fairDrop.createCampaign("ipfs://second", 10, start, end);
        bytes32 nullifier = keccak256("human-1");

        vm.startPrank(RELAYER);
        fairDrop.claim(first, nullifier);
        fairDrop.claim(second, nullifier);
        vm.stopPrank();

        assertTrue(fairDrop.hasClaimed(first, nullifier));
        assertTrue(fairDrop.hasClaimed(second, nullifier));
    }

    function testRejectsUnauthorizedRelayer() public {
        uint256 campaignId = _create(10);
        vm.expectRevert(abi.encodeWithSelector(FairDrop.UnauthorizedRelayer.selector, OTHER));
        vm.prank(OTHER);
        fairDrop.claim(campaignId, keccak256("human-1"));
    }

    function testOwnerCanRotateRelayer() public {
        uint256 campaignId = _create(10);
        fairDrop.setRelayer(OTHER);

        vm.prank(OTHER);
        fairDrop.claim(campaignId, keccak256("human-1"));
        assertEq(fairDrop.getCampaign(campaignId).totalClaimed, 1);

        vm.expectRevert(abi.encodeWithSelector(FairDrop.UnauthorizedRelayer.selector, RELAYER));
        vm.prank(RELAYER);
        fairDrop.claim(campaignId, keccak256("human-2"));
    }

    function testRejectsInactiveCampaign() public {
        uint256 campaignId = _create(10);
        fairDrop.setCampaignActive(campaignId, false);
        vm.expectRevert(abi.encodeWithSelector(FairDrop.CampaignInactive.selector, campaignId));
        vm.prank(RELAYER);
        fairDrop.claim(campaignId, keccak256("human-1"));
    }

    function testRejectsExpiredCampaign() public {
        uint256 campaignId = _create(10);
        vm.warp(uint256(end) + 1);
        vm.expectRevert(abi.encodeWithSelector(FairDrop.CampaignEnded.selector, campaignId, end));
        vm.prank(RELAYER);
        fairDrop.claim(campaignId, keccak256("human-1"));
    }

    function testRejectsNotYetStartedCampaign() public {
        uint64 futureStart = uint64(block.timestamp + 1 days);
        uint256 campaignId = fairDrop.createCampaign("ipfs://future", 10, futureStart, futureStart + 1 days);
        vm.expectRevert(abi.encodeWithSelector(FairDrop.CampaignNotStarted.selector, campaignId, futureStart));
        vm.prank(RELAYER);
        fairDrop.claim(campaignId, keccak256("human-1"));
    }

    function testRejectsSoldOutCampaign() public {
        uint256 campaignId = _create(1);
        vm.prank(RELAYER);
        fairDrop.claim(campaignId, keccak256("human-1"));
        vm.expectRevert(abi.encodeWithSelector(FairDrop.SoldOut.selector, campaignId));
        vm.prank(RELAYER);
        fairDrop.claim(campaignId, keccak256("human-2"));
    }

    function testOwnerOnlyAdminFunctions() public {
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", OTHER));
        vm.prank(OTHER);
        fairDrop.createCampaign("ipfs://unauthorized", 1, start, end);

        uint256 campaignId = _create(1);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", OTHER));
        vm.prank(OTHER);
        fairDrop.setCampaignActive(campaignId, false);

        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", OTHER));
        vm.prank(OTHER);
        fairDrop.setRelayer(OTHER);

        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", OTHER));
        vm.prank(OTHER);
        fairDrop.updateCampaign(campaignId, "ipfs://unauthorized", 1, start, end);
    }

    function testUpdateCannotReduceSupplyBelowClaims() public {
        uint256 campaignId = _create(2);
        vm.prank(RELAYER);
        fairDrop.claim(campaignId, keccak256("human-1"));
        vm.prank(RELAYER);
        fairDrop.claim(campaignId, keccak256("human-2"));

        vm.expectRevert(abi.encodeWithSelector(FairDrop.SupplyBelowClaimed.selector, uint64(1), uint64(2)));
        fairDrop.updateCampaign(campaignId, "ipfs://changed", 1, start, end);
    }

    function testRejectsUnknownCampaign() public {
        vm.expectRevert(abi.encodeWithSelector(FairDrop.CampaignNotFound.selector, 404));
        fairDrop.getCampaign(404);
    }

    function testRejectsZeroRelayerAddress() public {
        vm.expectRevert(FairDrop.InvalidRelayer.selector);
        fairDrop.setRelayer(address(0));
    }
}
