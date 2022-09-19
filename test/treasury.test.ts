import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { constants } from "../scripts/constants";
import { expect } from "chai";

describe("Treasury Testing", function () {
  it("Deploy Treasury and Treasury Helper", async function () {
    const [deployer] = await ethers.getSigners();

    const MIM = await ethers.getContractFactory("MIM");
    const mim = await MIM.deploy();
    await mim.deployed();

    const BDN = await ethers.getContractFactory("BDN");
    const bdn = await BDN.deploy();
    await bdn.deployed();

    const TreasuryHelper = await ethers.getContractFactory("TreasuryHelper");
    const treasuryHelper = await TreasuryHelper.deploy(
      bdn.address,
      mim.address,
      0
    );
    await treasuryHelper.deployed();

    // bond depository address will go here
    await treasuryHelper.queue("0", deployer.address);

    // bond depository address will go here
    await treasuryHelper.toggle(
      "0",
      deployer.address,
      "0x0000000000000000000000000000000000000000"
    );

    // reserve spender address will go here. They will burn BDN
    await treasuryHelper.queue("1", deployer.address);

    // reserve spender address will go here
    await treasuryHelper.toggle(
      "1",
      deployer.address,
      "0x0000000000000000000000000000000000000000"
    );

    // reserve manager address will go here. They will allocate money
    await treasuryHelper.queue("3", deployer.address);

    // reserve manager address will go here. They will allocate money
    await treasuryHelper.toggle(
      "3",
      deployer.address,
      "0x0000000000000000000000000000000000000000"
    );

    const Treasury = await ethers.getContractFactory("Treasury");
    const treasury = await Treasury.deploy(
      bdn.address,
      treasuryHelper.address
    );
    await treasury.deployed();

    // Only treasury can mint BDN.
    await bdn.setVault(treasury.address);

    expect(await treasury.treasuryHelper()).to.equal(
      await treasuryHelper.address
    );
    expect(await treasury.BDN()).to.equal(bdn.address);

    // mint mim for msg.sender
    await mim.mint(deployer.address, "100000000000000000000");

    const TAVCalculator = await ethers.getContractFactory("TAVCalculator");
    const tavCalculator = await TAVCalculator.deploy(
      bdn.address,
      treasury.address
    );
    await tavCalculator.deployed();

    // approve large number for treasury, so that it can move
    await mim.approve(treasury.address, constants.largeApproval);

    // approve treasury address for a user so that treasury can burn bdn for user
    await bdn.approve(treasury.address, constants.largeApproval);

    await treasury.setTAVCalculator(tavCalculator.address);

    expect(await mim.balanceOf(deployer.address)).to.equal(
      "100000000000000000000"
    );

    // Deposit 10 MIM and mint 5 BDN
    await treasury.deposit(
      "10000000", // reserve token amount to deposit
      mim.address,
      "5000000000000000000" // amount of bdn to mint
    );

    expect(await treasury.totalReserves()).to.equal("10000000000000000000");

    // assuming the BDN price to be 1$, burn 2.5$ of BDN and retrive 2.5$
    // mim balance after this method for deployer is 92500000000000000000
    await treasury.withdraw("2500000", mim.address);

    expect(await treasury.totalReserves()).to.equal("7500000000000000000");

    // mim balance after this method for deployer is 97500000000000000000
    await treasury.manage(mim.address, "5000000000000000000");

    expect(await treasury.totalReserves()).to.equal("2500000000000000000");
    expect(await mim.balanceOf(deployer.address)).to.equal(
      "97500000000000000000"
    );
  });
});
