import { ethers } from "hardhat";
import { expect } from "chai";

describe("Staked BDN Test-Cases", function () {
  it("mint sBDN via staking address", async function () {
    const [deployer] = await ethers.getSigners();

    const StakedBDN = await ethers.getContractFactory("StakedBDN");
    const stakedBDN = await StakedBDN.deploy();
    await stakedBDN.deployed();

    expect(await stakedBDN.initializer(), deployer.address);

    // Staking Address will go here
    await stakedBDN.initialize(deployer.address);

    await stakedBDN.mint(
      "0xa5BA5b45F73e4070492FBC801CBfF05F1A3FaDb8",
      "10000000000000000000"
    );

    expect(
      await stakedBDN.balanceOf("0xa5BA5b45F73e4070492FBC801CBfF05F1A3FaDb8")
    ).to.equal("10000000000000000000");

    expect(await stakedBDN.totalSupply()).to.equal("10000000000000000000");
  });
});
