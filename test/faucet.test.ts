import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";

describe("BDN Faucet Test", function () {
  let bdn: Contract,
    mim: Contract,
    deployer: any,
    user1: any,
    user2: any,
    bdnFaucet: Contract;
  before(async () => {
    [deployer, user1, user2] = await ethers.getSigners();

    const MIM = await ethers.getContractFactory("MIM");
    mim = await MIM.deploy();
    await mim.deployed();

    const BDN = await ethers.getContractFactory("BDN");
    bdn = await BDN.deploy();
    await bdn.deployed();

    const BdnFaucet = await ethers.getContractFactory("BdnFaucet");
    bdnFaucet = await BdnFaucet.deploy(bdn.address);
    await bdnFaucet.deployed();

    await bdn.setVault(deployer.address);
  });

  it("BDN faucet test", async function () {
    await bdn.mint(bdnFaucet.address, "500000000000000000000000");

    expect(await bdn.balanceOf(bdnFaucet.address)).to.be.equal(
      "500000000000000000000000"
    );

    await bdnFaucet.faucet(user1.address);

    expect(await bdn.balanceOf(bdnFaucet.address)).to.be.equal(
      "499900000000000000000000"
    );

    await bdnFaucet.faucet(user2.address);

    expect(await bdn.balanceOf(bdnFaucet.address)).to.be.equal(
      "499800000000000000000000"
    );

    expect(await bdn.balanceOf(user1.address)).to.be.equal(
      "100000000000000000000"
    );

    expect(await bdn.balanceOf(user2.address)).to.be.equal(
      "100000000000000000000"
    );
  });
});
