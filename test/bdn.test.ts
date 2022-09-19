import { ethers } from "hardhat";
import { constants } from "../scripts/constants";
import { expect } from "chai";
import { Contract } from "ethers";

describe("BDN Test", function () {
  let bdn: Contract,
    mim: Contract,
    deployer: any;
  before(async () => {
    [deployer] = await ethers.getSigners();

    const MIM = await ethers.getContractFactory("MIM");
    mim = await MIM.deploy();
    await mim.deployed();

    const BDN = await ethers.getContractFactory("BDN");
    bdn = await BDN.deploy();
    await bdn.deployed();

    // This will be the address of treasury
    await bdn.setVault(deployer.address);
  });

  it("Should check vault address", async function () {

    expect(await bdn.vault()).to.equal(deployer.address);

    await bdn.approve(deployer.address, "1000000000000000000");
    await bdn.mint(deployer.address, "1000000000000000000");

    expect(await bdn.balanceOf(deployer.address)).to.equal(
      "1000000000000000000"
    );
  });

  it("Should burn minted BDN", async function () {

    await bdn.burn("1000000000000000000");

    expect(await bdn.balanceOf(deployer.address)).to.equal(
      "0"
    );
  });
});
