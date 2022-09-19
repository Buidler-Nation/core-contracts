// SPDX-License-Identifier: Apache 2.0
pragma solidity ^0.8.0;

import "./interface/IERC20.sol";

contract BdnFaucet {
    IERC20 public immutable bdnContract;
    mapping(address => uint256) private _userMapping;

    constructor(address bdnAddress) {
        require(bdnAddress != address(0));
        bdnContract = IERC20(bdnAddress);
    }

    function faucet(address to_) external {
        require(to_ != address(0));
        require(_userMapping[to_] < (1e19), "User has BDN");
        require(bdnContract.balanceOf(address(this)) >= 1e20, "Insufficient BDN balance in faucet contract");
        bdnContract.transfer(to_, 1e20);
    }
}
