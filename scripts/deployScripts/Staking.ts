// @ts-ignore
import { ethers } from "hardhat";
import { saveFrontendFiles, readContractAddress } from "../helpers";

// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  const bdnAddress = readContractAddress("/BDN.json");
  const sBDNAddress = readContractAddress("/StakedBDN.json");

  const Staking = await ethers.getContractFactory("Staking");
  const stakingContract = await Staking.deploy(bdnAddress, sBDNAddress);
  await stakingContract.deployed();

  console.log("Token address of staking:", stakingContract.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(stakingContract, "Staking");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
