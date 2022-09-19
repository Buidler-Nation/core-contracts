// @ts-ignore
import { ethers } from "hardhat";
import {readContractAddress, saveFrontendFiles} from "../helpers";
import { constants } from "../constants";

async function main() {
  const LpAssetFact = await ethers.getContractFactory("LpAsset");
  const mimAddress = readContractAddress("/MIM.json");
  const lpAsset = await LpAssetFact.deploy(
    constants.lpAddress,
    mimAddress
  );
  await lpAsset.deployed();

  console.log("Token address of lpAsset:", lpAsset.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(lpAsset, "LpAsset");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
