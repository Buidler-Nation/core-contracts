// @ts-ignore
import { ethers } from "hardhat";
import { readContractAddress } from "../../helpers";

const sBDNAdd = readContractAddress("/StakedBDN.json");
const stakingAdd = readContractAddress("/Staking.json");

async function main() {
  const StakedBDN = await ethers.getContractFactory("StakedBDN");
  const sBDN = await StakedBDN.attach(sBDNAdd);
  await sBDN.initialize(stakingAdd);
  console.log("step 7");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
