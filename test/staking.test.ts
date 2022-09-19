import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Staking Test", function () {
  let deployer: SignerWithAddress;
  // let staker: SignerWithAddress;
  const stakingAmount = "100000000000000000000";
  let stakingAddress: any;
  let bdn: Contract;
  let sbdn: Contract;
  let DAO: any;
  let staking: Contract;
  let rewardDistributor: Contract;

  const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms));

  beforeEach(async () => {
    [deployer, DAO] = await ethers.getSigners();
    stakingAddress = deployer.address;

    const MIM = await ethers.getContractFactory("MIM");
    const mim = await MIM.deploy();
    await mim.deployed();

    const BDN = await ethers.getContractFactory("BDN");
    bdn = await BDN.deploy();
    await bdn.deployed();

    // Only treasury can mint BDN.
    await bdn.setVault(deployer.address);

    await bdn.mint(stakingAddress, stakingAmount);

    const sBDN = await ethers.getContractFactory("StakedBDN");
    sbdn = await sBDN.deploy();
    await sbdn.deployed();

    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(bdn.address, sbdn.address);
    await staking.deployed();

    const RewardDistributor = await ethers.getContractFactory(
      "RewardDistributor"
    );
    rewardDistributor = await RewardDistributor.deploy(
      staking.address,
      sbdn.address
    );
    await rewardDistributor.deployed();

    staking.setRewardDistributor(rewardDistributor.address);
    await sbdn.initialize(staking.address);
  });

  describe("Test user Stake and unstake", function () {
    it("Test user Stake and unstake", async function () {
      await bdn.approve(staking.address, stakingAmount);
      await staking.stake(stakingAddress, stakingAmount);

      expect(await sbdn.balanceOf(stakingAddress)).to.equal(stakingAmount);
      expect(await sbdn.balanceOf(staking.address)).to.equal(0);

      expect(await bdn.balanceOf(staking.address)).to.equal(stakingAmount);
      expect(await bdn.balanceOf(stakingAddress)).to.equal(0);

      await staking.unstake(stakingAddress, stakingAmount);
      expect(await sbdn.balanceOf(stakingAddress)).to.equal(0);
      expect(await sbdn.balanceOf(staking.address)).to.equal(0);

      expect(await bdn.balanceOf(staking.address)).to.equal(0);
      expect(await bdn.balanceOf(stakingAddress)).to.equal(stakingAmount);
    });
  });

  describe("Test user Stake with warmup and claim and then unstake", function () {
    it("Test user Stake with warmup and claim and then unstake", async function () {
      await staking.setWarmupLength(1);
      await bdn.approve(staking.address, stakingAmount);
      await staking.stake(stakingAddress, stakingAmount);

      expect(await sbdn.balanceOf(stakingAddress)).to.equal(0);
      expect(await sbdn.balanceOf(staking.address)).to.equal(0);

      expect(await bdn.balanceOf(staking.address)).to.equal(stakingAmount);
      expect(await bdn.balanceOf(stakingAddress)).to.equal(0);

      await delay(1000);
      await staking.claim(stakingAddress);

      expect(await sbdn.balanceOf(stakingAddress)).to.equal(stakingAmount);
      expect(await sbdn.balanceOf(staking.address)).to.equal(0);

      expect(await bdn.balanceOf(staking.address)).to.equal(stakingAmount);
      expect(await bdn.balanceOf(stakingAddress)).to.equal(0);

      await staking.unstake(stakingAddress, stakingAmount);
      expect(await sbdn.balanceOf(stakingAddress)).to.equal(0);
      expect(await sbdn.balanceOf(staking.address)).to.equal(0);

      expect(await bdn.balanceOf(staking.address)).to.equal(0);
      expect(await bdn.balanceOf(stakingAddress)).to.equal(stakingAmount);
    });
  });

  describe("Test user Stake with warmup and forfeit", function () {
    it("DTest user Stake with warmup and forfeit", async function () {
      await staking.setWarmupLength(1);
      await bdn.approve(staking.address, stakingAmount);
      await staking.stake(stakingAddress, stakingAmount);

      expect(await sbdn.balanceOf(stakingAddress)).to.equal(0);
      expect(await sbdn.balanceOf(staking.address)).to.equal(0);

      expect(await bdn.balanceOf(staking.address)).to.equal(stakingAmount);
      expect(await bdn.balanceOf(stakingAddress)).to.equal(0);

      await staking.forfeit();

      expect(await sbdn.balanceOf(stakingAddress)).to.equal(0);
      expect(await sbdn.balanceOf(staking.address)).to.equal(0);

      expect(await bdn.balanceOf(staking.address)).to.equal(0);
      expect(await bdn.balanceOf(stakingAddress)).to.equal(stakingAmount);
    });
  });
});
