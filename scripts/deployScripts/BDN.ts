// @ts-ignore
import { ethers } from "hardhat";
import { saveFrontendFiles } from "../helpers";

// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  const [deployer] = await ethers.getSigners();

  const BDN = await ethers.getContractFactory("BDN");
  const bdn = await BDN.deploy();
  await bdn.deployed();

  console.log("Token address of bdn:", bdn.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(bdn, "BDN");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
