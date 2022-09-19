#!/bin/bash

npx hardhat run ./scripts/deployScripts/Initialize/bdn.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/Initialize/mim.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/Initialize/bond.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/Initialize/treasuryHelper.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/Initialize/treasury.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/Initialize/staking.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/Initialize/sbdn.ts --network evmostest &&
npx hardhat run ./scripts/deployScripts/Initialize/rewardDistributor.ts --network evmostest
#npx hardhat run ./scripts/deployScripts/Initialize/lpManager.ts --network evmostest