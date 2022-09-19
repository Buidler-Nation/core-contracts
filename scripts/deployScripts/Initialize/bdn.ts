// @ts-ignore
import { ethers } from "hardhat";
import { readContractAddress } from "../../helpers";
import { constants } from "../../constants";

const bdnAdd = readContractAddress("/BDN.json");
const treasuryAdd = readContractAddress("/Treasury.json");

async function main() {
  const [deployer] = await ethers.getSigners();
  const BDN = await ethers.getContractFactory("BDN");
  const bdn = await BDN.attach(bdnAdd);

  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.attach(treasuryAdd);

  await bdn.setVault(deployer.address);

  // await bdn.mint(constants.nttContractAddress, "181000000000000000000000");
  await bdn.mint(deployer.address, "100000000000000000000000");

  console.log("step 6");

  await bdn.setVault(treasury.address);
  console.log("vault set completed");

  // approve treasury address for a user so that treasury can burn bdn for user
  await bdn.approve(treasury.address, constants.largeApproval);
  console.log("bdn approve completed");

  await bdn.setBaseSellTax(5);
  console.log("sell tax value is 5");

  await bdn.setMultiplier(0);
  console.log("multiplier is 0");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
