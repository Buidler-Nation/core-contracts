// @ts-ignore
import { ethers } from "hardhat";
import { readContractAddress, saveFrontendFiles } from "../helpers";

// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.address
  );

  const bdnAddress = readContractAddress("/BDN.json");

  const BdnFaucet = await ethers.getContractFactory("BdnFaucet");
  const bdnFaucet = await BdnFaucet.deploy(bdnAddress);
  await bdnFaucet.deployed();

  console.log("Token address of bdnFaucet:", bdnFaucet.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(bdnFaucet, "BdnFaucet");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
