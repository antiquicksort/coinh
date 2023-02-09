// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyCoin is ERC20 {
    constructor(string memory, string memory)
        public
        ERC20("Hackers Live Coin", "HCL")
    {
        _mint(msg.sender, 1000000);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function name() public view virtual override returns (string memory) {
        return "Hackers Live Coin";
    }

    function symbol() public view virtual override returns (string memory) {
        "HCL";
    }

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    receive() external payable {}
}
