#!/bin/bash

npx hardhat run ./scripts/deployScripts/BDN.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/MIM.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/TreasuryHelper.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/Treasury.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/TAVCalculator.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/sBDN.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/Staking.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/Bonding.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/RewardDistributor.ts --network evmostest
#npx hardhat run ./scripts/deployScripts/LpAsset.ts --network evmostest &&
#npx hardhat run ./scripts/deployScripts/LpManager.ts --network evmostest