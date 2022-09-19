// @ts-ignore
import { ethers } from "hardhat";
import { readContractAddress } from "../../helpers";
import { constants } from "../../constants";

const bdnAdd = readContractAddress("/BDN.json");
const treasuryAdd = readContractAddress("/Treasury.json");
const lpManagerAdd = readContractAddress("/LpManager.json");
const lpAssetAdd = readContractAddress("/LpAsset.json");
const tavCalculatorAdd = readContractAddress("/TAVCalculator.json");

async function main() {
  const [deployer] = await ethers.getSigners();
  const BDN = await ethers.getContractFactory("BDN");
  const bdn = await BDN.attach(bdnAdd);

  const LpManagerFact = await ethers.getContractFactory("LpManager");
  const LpManager = await LpManagerFact.attach(lpManagerAdd);

  const TAVCalculator = await ethers.getContractFactory("TAVCalculator");
  const tavCalculator = await TAVCalculator.attach(tavCalculatorAdd);

  await bdn.addLpContractAddress(constants.lpAddress);

  await LpManager.addLpAssetManager(lpAssetAdd);

  await tavCalculator.addAssetManager(lpManagerAdd);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
