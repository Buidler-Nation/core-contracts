// @ts-ignore
import { ethers} from "hardhat";
import { saveFrontendFiles } from "../helpers";

async function main() {
  const StakedBDN = await ethers.getContractFactory("StakedBDN");
  const sBDN = await StakedBDN.deploy();
  await sBDN.deployed();

  console.log("Token address of sBDN:", sBDN.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(sBDN, "StakedBDN");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});